import { RecipesService } from './../../services/recipes';
import { Component, OnInit } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode = 'Novo';
  selectOptions = ['Fácil', 'Médio', 'Difícil']
  recipeForm: FormGroup

  constructor(private navParams: NavParams,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private recipesService: RecipesService) { }

  ngOnInit() {
    this.mode = this.navParams.get('mode')
    this.initializeForm()
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      title: 'O que você quer fazer ?',
      buttons: [{
        text: 'Adicionar ingrediente',
        handler: () => {
          this.creatNewIngredientAlert().present()
        }
      }, {
        text: 'Remover todos os ingredientes',
        role: 'destructive',
        handler: () => {
          const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients')
          const len = fArray.length
          if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
              fArray.removeAt(i)
            }
            const toast = this.toastCtrl.create({
              message: 'Todos os ingredientes excluidos!',
              duration: 1500,
              position: 'bottom'
            })
            toast.present()
          }
        }
      }, {
        text: "Cancelar",
        role: 'cancel'
      }]
    })

    actionSheet.present()

  }
  private creatNewIngredientAlert() {
    return this.alertCtrl.create({
      title: 'Adicionar ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Adicionar',
          handler: data => {
            if (data.name.trim() == '' || data.name == null) {
              const toast = this.toastCtrl.create({
                message: 'Por favor entre com um valor válido',
                duration: 1500,
                position: 'bottom'
              })
              toast.present()
              return
            }
            (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name,
              Validators.required))
            const toast = this.toastCtrl.create({
              message: 'Ingrediente adicionado',
              duration: 1500,
              position: 'bottom'
            })
            toast.present()
            console.log(this.recipeForm)
          }
        }

      ]
    })
  }

  onSubmit() {
    const value = this.recipeForm.value;
    let ingredients = []
    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return {name:name, amount: 1}
      })
    }
    this.recipesService.addRecipe(value.title, value.description, value.difficulty, ingredients)
    this.recipeForm.reset()
    this.navCtrl.popToRoot()
  }

  private initializeForm() {
    this.recipeForm = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'difficulty': new FormControl('Médio', Validators.required),
      'ingredients': new FormArray([])
    })
  }



}

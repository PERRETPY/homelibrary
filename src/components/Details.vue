<template>
  <div class="container" v-if="!loading">
    <div style="margin: 1em">
      <div class="columns">
        <div class="column is-half-tablet" v-if="book">
          <div v-if="isInDatabase">
            <img v-if="book.imageLink" class="book-cover" v-bind:src="book.imageLink" alt="">
            <img v-else class="book-cover" src="../assets/book_cover_placeholder.png" alt="">
          </div>
          <div v-else>
            <img v-if="book.imageLinks" class="book-cover" v-bind:src="book.imageLinks.thumbnail" alt="">
            <img v-else class="book-cover" src="../assets/book_cover_placeholder.png" alt="">
          </div>
        </div>
        <div class="column is-half-tablet details" v-if="book">
          <div class="card">
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <h2 class="title is-2">{{ book.title }}</h2>
                  <h5 class="title is-5" v-if="book.authors">{{ book.authors.join(', ') }}</h5>
                  <h5 class="title is-5">Date de parution : {{ book.publishedDate }}</h5>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isInDatabase && book.tags" class="tags">
            <div class="tag button-primary" v-for="tag in book.tags" :key="book.tags.indexOf(tag)">
              {{ tag }}
              <button class="delete is-small" @click="onDeleteTag(book.tags.indexOf(tag))"></button>
            </div>
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="text" placeholder="tag" list="tagList" v-model="addTag">
                <datalist id="tagList">
                  <option v-for="tag in allOtherTags" :key="tag">{{tag}}</option>
                </datalist>
              </div>
              <div class="control">
                <button class="button button-primary" @click="onAddTag()" :disabled="addTag===''">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
          <div class="available-button">
            <button
                v-if="isInDatabase"
                class="button is-rounded"
                :class="{ 'is-success': book.available, 'is-danger': !book.available }"
                @click="onAvailableClick()">
              <span v-if="book.available">Disponnible</span>
              <span v-else>Indisponnible</span>
            </button>


            <div class="field has-addons" v-if="isInDatabase">
              <div class="control is-expanded">
                <input class="input available-input" type="text" v-model="book.availableNote" placeholder="Pourquoi ce livre n'est pas disponnible ?" :disabled="book.available">
              </div>
              <div class="control">
                <button class="button button-primary" @click="onSave" :disabled="book.available">
                  Sauvegarder
                </button>
              </div>
            </div>

          </div>
          <div>
            <button
                v-if="isInDatabase"
                class="button is-rounded"
                :class="{ 'is-success': book.read, 'is-danger': !book.read }"
                @click="onReadClick()">
              <span v-if="book.read">Lu</span>
              <span v-else>Non lu</span>
            </button>
          </div>
        </div>
      </div>

      <div class="container">

        <div class="description-block">
          <h6 class="title is-6">Description : </h6>
          <p class="description" v-if="book.description" v-html="book.description"/>
          <p v-else> pas de description pour le moment</p>
        </div>

        <div v-if="book.read">
          <h6 v-if="book.selfRate === undefined"><b>Evaluez-moi !</b></h6>
          <star-rating v-if="isInDatabase" v-model:rating="book.selfRate" :increment="0.5" @update:rating="onSave"/>
        </div>
        <div v-if="book">
          <div v-if="book.ratingsCount && book.ratingsCount > 0">
            <p>{{ book.ratingsCount }} avis </p>
            <star-rating v-model:rating="book.averageRating" :star-size="20" :round-start-rating="false" :read-only="true"></star-rating>
          </div>
          <div v-else>
            <p><i>Pas d'autres avis pour le moment </i></p>
            <star-rating v-model:rating="book.averageRating" :star-size="20" :round-start-rating="false" :read-only="true"></star-rating>
          </div>
        </div>


        <div class="field" v-if="isInDatabase">
          <label class="label">Mon avis</label>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea class="textarea" :placeholder="book.review ? '' : 'Comment avez-vous trouvé ce livre ?'" v-model="book.review"></textarea>
              </div>
            </div>
          </div>
        </div>


        <div class="field" v-if="isInDatabase">
          <div class="field-body">
            <div class="field">
              <div class="control">
                <button @click="onSave()" class="button button-primary">
                  <span>Sauvegarder mon avis</span>
                </button>
              </div>
            </div>
          </div>
        </div>



        <div class="field">
          <div class="field-body">
            <div class="field">
              <div class="control">
                <button v-if="isInDatabase" @click="onDelete()" class="button is-danger">
                  Supprimer de ma bibliothèque
                </button>
                <button @click="onSave()" class="button button-primary" v-if="!isInDatabase">
                  <span >Ajouter</span>
                </button>
                <button v-if="isNativePlatform && isInDatabase" @click="share()" class="button button-primary">
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>

<script>
import StarRating from "vue-star-rating";
import { Share } from '@capacitor/share';
import { GoogleServer } from "../services/ServerService";
import ToastService from "../services/toastService";
import { CapacitorStorage } from "../services/StorageService"


import {Capacitor} from "@capacitor/core";

export default {
  name: "Details.vue",
  props: {
    id: String
  },
  components: {
    StarRating,
  },
  data() {
    return {
      book: {},
      loading: false,
      status: "over",
      addTag: "",
      allOtherTags: [],
      isInDatabase: false,
      isNativePlatform: Capacitor.isNativePlatform(),
      storageService: {},
      serverService: {},
      toastService: {}
    }
  },
  mounted() {
    this.loading = true;
    this.toastService = ToastService.getInstance();
    this.storageService = new CapacitorStorage();
    this.serverService = new GoogleServer();
    this.storageService.existByISBN(this.id).then(
        (exist) => {
          this.isInDatabase = exist;
          this.loadBook();
      }
    );
  },
  methods: {
    onSave: function() {
      if(this.isInDatabase) {
        this.updateBook(this.id, this.book);
      }else {
        this.addBookToDatabase(this.book);
      }
    },

    async getAllOtherTags() {
      const categoryTags =
          ['Art musique et cinéma',
            'Bandes dessinées',
            'Cuisine',
            'Développement personnel',
            'Dictionnaires & langues',
            'Droit & économie',
            'Essais et documents',
            'Guides pratiques',
            'Histoire',
            'Humour',
            'Informatique et internet',
            'Jeunesse',
            'Littérature',
            'Littérature sentimentale',
            'Policier',
            'suspense',
            'thrillers',
            'Religion et spiritualité',
            'Sciences sociales',
            'Sciences',
            'techniques & médecine',
            'Scolaire',
            'SF',
            'Fantasy',
            'Sport loisirs et vie pratique',
            'Théâtre',
            'Tourisme et voyages'];

      let allTags = [];

      const allBook = await this.storageService.getAllBooks();
      allBook.forEach(
          (book) => {
            book.tags.forEach(
                (tag) => {
                  if(!this.book.tags.includes(tag)) {
                    allTags.push(tag);
                  }
                }
            )
          }
      );
      categoryTags.forEach(
          (tag) => {
            if(!this.book.tags.includes(tag)) {
              allTags.push(tag);
            }
          }
      )

      allTags = allTags.filter(this.onlyUnique);
      this.allOtherTags = allTags;
    },

    onlyUnique: function(value, index, self) {
      return self.indexOf(value) === index;
    },

    onDelete: function() {
      this.storageService.removeBookByISBN(this.id)
          .then(
              () => {
                this.toastService.show("Supression réussi", "is-info");
                this.isInDatabase = false;
                this.loadBookFromServer();
              }
          )
          .catch(
              () => {
                this.toastService.show("Erreur lors de la mise à jour", "is-danger");
              }
          );
    },

    async addBookToDatabase(book) {
      try {
        let newBook = {};

        newBook.isbn = this.id;
        newBook.title = book.title;
        newBook.authors = [];
        newBook.publishedDate = book.publishedDate;
        newBook.description = book.description;
        newBook.tags = [];
        newBook.ratingsCount = book.ratingsCount;
        newBook.averageRating = book.averageRating;
        newBook.rate = book.rate;
        newBook.selfRate = undefined;
        newBook.review = undefined;
        newBook.available = true;
        newBook.read = false;
        newBook.availableNote = undefined;
        if(book.imageLinks && book.imageLinks.thumbnail) {
          newBook.imageLink = book.imageLinks.thumbnail;
        }

        book.authors.forEach((author) => {
          newBook.authors.push(author);
        });

        this.storageService.addBook(newBook).then(
            () => {
              this.toastService.show("Ajout réussi", "is-info");
            }
        )
            .catch(
                () => {
                  this.toastService.show("Erreur lors de l'ajout'", "is-danger");
                }
            );

        this.loadBookFromDatabase();
        this.isInDatabase = true;

      } catch (error) {
        this.toastService.show("Erreur lors de l'ajout", "is-danger");
      }
    },

    updateBook: function(id, book) {
      let updateBook = {};

      updateBook.isbn = this.id;
      updateBook.title = book.title;
      updateBook.authors = [];
      updateBook.publishedDate = book.publishedDate;
      updateBook.description = book.description;
      updateBook.tags = [];
      updateBook.ratingsCount = book.ratingsCount;
      updateBook.averageRating = book.averageRating;
      updateBook.rate = book.rate;
      updateBook.selfRate = book.selfRate;
      updateBook.review = book.review;
      updateBook.available = book.available;
      updateBook.read = book.read;
      updateBook.availableNote = book.availableNote;

      if(book.imageLink) {
        updateBook.imageLink = book.imageLink;
      }

      book.tags.forEach((tag) => {
        updateBook.tags.push(tag);
      });

      book.authors.forEach((author) => {
        updateBook.authors.push(author);
      });

      this.storageService.updateBook(id, updateBook)
        .then(
              () => {
                this.toastService.show("Mise à jour réussi", "is-info");
              }
          )
          .catch(
              () => {
                this.toastService.show("Erreur lors de la mise à jour", "is-danger");
              }
          );
    },

    onDeleteTag: function(key) {
      this.book.tags.splice(key, 1);
      this.onSave();
      this.getAllOtherTags();
    },

    onAddTag: function() {
      this.book.tags.push(this.addTag);
      this.addTag = "";
      this.onSave();
      this.getAllOtherTags();
    },

    onAvailableClick: function() {
      this.book.availableNote = undefined;
      this.book.available = !this.book.available;
      this.onSave();
    },

    onReadClick: function() {
      this.book.selfRate = undefined;
      this.book.read = !this.book.read;
      this.onSave();
    },

    loadBook: function() {
      if(this.isInDatabase) {
        this.loadBookFromDatabase();
      }else {
        this.loadBookFromServer();
      }
    },

    loadBookFromDatabase: function () {
      this.getAllOtherTags();
      this.storageService.getBookByISBN(this.id).then(
          (book) => {
            this.book = book;
            this.loading = false;
          },
          () => {
            this.toastService.show('Erreur lors de la réccupération', 'is-warning');
            this.loadBookFromServer();
          }
      )
    },

    loadBookFromServer: function() {
      this.serverService.getBookByISBN(this.id)
          .then(
            (response) => {
              this.book = response.data.volumeInfo;
              this.loading = false;
            })
          .catch(
              () => {
                this.toastService.show('Aucun livre trouvé avec l\'isbn ' + this.id, 'is-danger');
                this.$router.push({
                  name: "Search"
                });
              }
          );
    },

    async share() {
      let text = 'J\'ai ajouté ' + this.book.title + ' dans l\'application HomeLibrary';
      if(this.book.selfRate) {
        text = text.concat(' et je lui ai mis la note de ' + this.book.selfRate + '/5');
      }
      await Share.share({
        title: 'HomeLibrary',
        text: text,
        url: 'https://github.com/perretpy',
        dialogTitle: 'Share with HomeLibrary',
      });
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 1em;
}
  .book-cover {
    height: 100%;
    max-height: 30em;
  }
  .tag {
    margin-right: 1em;
    margin-bottom: 1em;
  }
  .description {
    max-height: 20em;
    overflow: scroll;
    box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
    border-radius: .3em;
    padding: .3em;
  }
  .details {
    max-height: 100%;
  }
  textarea {
    resize: none;
  }
  img {
    width: 100%;
    object-fit: contain;
  }
  .card {
    margin-bottom: 2em;
  }
  .tags {
    margin-bottom: 1em;
    display: block;
  }
  .description-block {
    margin-bottom: 1em;
  }
  .available-button {
    margin-top: 2em;
    margin-bottom: 2em;
  }
  .available-button button {
    margin-bottom: 1em;
  }
  .button-primary {
    background-color: #A29C43;
    color: white;
  }
</style>

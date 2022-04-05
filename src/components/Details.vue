<template>
  <div class="container" v-if="!loading">
    <div class="columns">
      <div class="column is-half-tablet" v-if="book">
        <img v-if="book.imageLinks" class="book-cover" v-bind:src="book.imageLinks.thumbnail" alt="">
        <img v-else class="book-cover" src="../assets/book_cover_placeholder.png" alt="">
      </div>
      <div class="column is-half-tablet details" v-if="book">
        <h2>Titre : {{ book.title }}</h2>
        <h3 v-if="book.authors">Auteur : {{ book.authors.join(' ,') }}</h3>
        <h3>Date de parution : {{ book.publishedDate }}</h3>
        <div v-if="isInDatabase && book.tags">
          <span class="tag is-info" v-for="tag in book.tags" :key="book.tags.indexOf(tag)">
          {{ tag }}
          <button class="delete is-small" @click="onDeleteTag(book.tags.indexOf(tag))"></button>
        </span>
          <div>
            <input class="input" type="text" placeholder="tag" v-model="addTag">
            <button class="button" @click="onAddTag()">Add</button>
          </div>
        </div>

        <h3>Description : </h3>
        <p class="description" v-if="book.description" v-html="book.description"/>
        <p v-else> pas de description pour le moment</p>


        <star-rating v-if="isInDatabase" v-model:rating="book.selfRate" :increment="0.5"/>
        <div v-if="book">
          <div v-if="book.ratingsCount && book.ratingsCount > 0">
            <p>{{ book.ratingsCount }} avis </p>
            <star-rating v-model:rating="book.averageRating" :star-size="20" :round-start-rating="false" :read-only="true"></star-rating>
          </div>
          <div v-else>
            <p>pas d'avis pour le moment </p>
            <star-rating v-model:rating="book.averageRating" :star-size="20" :round-start-rating="false" :read-only="true"></star-rating>
          </div>
        </div>


        <div class="field" v-if="isInDatabase">
          <label class="label">Avis</label>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <textarea v-if="book.review" class="textarea" v-model="book.review"></textarea>
                <textarea v-else class="textarea" placeholder="Comment avez-vous trouvé ce livre ?" v-model="book.review"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div>
          Ce livre est
          <button
              v-if="isInDatabase"
              class="button is-rounded"
              :class="{ 'is-primary': book.available, 'is-danger': !book.available }"
              @click="onAvailableClick()">
            <span v-if="book.available">Disponnible</span>
            <span v-else>Indisponnible</span>
          </button>
        </div>
        <div>
          <button
              v-if="isInDatabase"
              class="button is-rounded"
              :class="{ 'is-primary': book.read, 'is-danger': !book.read }"
              @click="onReadClick()">
            <span v-if="book.read">Lu</span>
            <span v-else>Non lu</span>
          </button>
        </div>
        <div class="field ">
          <div class="field-body">
            <div class="field">
              <div class="control">
                <button v-if="isInDatabase" @click="onDelete()" class="button is-danger">
                  Supprimer
                </button>
                <button @click="onSave()" class="button is-primary">
                  <span v-if="isInDatabase">Sauvegarder</span>
                  <span v-else>Ajouter</span>
                </button>
                <button v-if="isNativePlatform && isInDatabase" @click="share()" class="button is-primary">
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
import axios from "axios";
import { Share } from '@capacitor/share';

import { DexieStorage, CapacitorStorage } from "../services/StorageService"


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
      isInDatabase: false,
      isNativePlatform: Capacitor.isNativePlatform(),
      storageService: {}
    }
  },
  mounted() {
    this.loading = true;
    if(this.isNativePlatform) {
      this.storageService = new CapacitorStorage();
    }else {
      this.storageService = new DexieStorage();
    }
    this.storageService.existByISBN(this.id).then((exist) => {
      this.isInDatabase = exist;
      this.loadBook();
    });

  },
  methods: {
    onSave: function() {
      console.log("onSave()");
      if(this.isInDatabase) {
        console.log("updateBook()");
        this.updateBook(this.id, this.book);
      }else {
        console.log("addBookToDatabase()");
        this.addBookToDatabase(this.book);
      }
    },

    onDelete: function() {
      console.log('onDelete : ' + this.book.id);
      this.storageService.removeBookByISBN(this.id).then(
          (deleted) => {
            if(deleted) {
              console.log("Successfully delete");
              this.isInDatabase = false;
              this.loadBookFromServer();
            }else {
              console.log("Error on delete");
            }
          }
      );
    },

    addBookToDatabase: function(book) {
      try {
        console.log("On adding book : " + book.isbn);

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

        book.authors.forEach((author) => {
          newBook.authors.push(author);
        });

        this.storageService.addBook(newBook).then(
            (added) => {
              if(added){
                console.log("Book add");
              }else {
                console.log("Book not add");
              }
          }
        )

        console.log("book add");

        this.status = `Books ${book.isbn}
          successfully added.`;

        this.loadBookFromDatabase();
        this.isInDatabase = true;

      } catch (error) {
        this.status = `Failed to add
          ${book.isbn}: ${error}`;
      }
    },

    updateBook: function(id, book) {
      let updateBook = {};

      updateBook.isbn = this.id;
      updateBook.tags = [];
      updateBook.selfRate = book.selfRate;
      updateBook.review = book.review;
      updateBook.available = book.available;
      updateBook.read = book.read;

      book.tags.forEach((tag) => {
        updateBook.tags.push(tag);
      });

      console.log('Available : ' + updateBook.available);

      this.storageService.updateBook(id, updateBook).then(
        (updated) => {
              console.log(updated);
      });
    },

    onDeleteTag: function(key) {
      this.book.tags.splice(key, 1)
    },

    onAddTag: function() {
      console.log(this.tags);
      this.book.tags.push(this.addTag);
      this.addTag = ""
    },

    onAvailableClick: function() {
      this.book.available = !this.book.available;
    },

    onReadClick: function() {
      this.book.read = !this.book.read;
    },

    loadBook: function() {
      if(this.isInDatabase) {
        this.loadBookFromDatabase();
      }else {
        this.loadBookFromServer();
      }
    },

    loadBookFromDatabase: function () {
      console.log("loadBookFromDatabase");
      this.storageService.getBookByISBN(this.id).then(
          (book) => {
            this.book = book;
            console.log('Available load : ' + this.book.available);
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.loadBookFromServer();
          }
      )
    },

    loadBookFromServer: function() {
      console.log('get book from server');
      axios
          .get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+this.id)
          .then((response) => {
            axios
                .get(response.data.items[0].selfLink)
                .then((responseBook) => {
                  const book = responseBook.data.volumeInfo;

                  this.book = book;

                  this.loading = false;
                })
                .catch((error) => {
                  console.log(error);
                })
          })
          .catch((error) => {
            console.log(error);
          });
    },

    async share() {
      await Share.share({
        title: 'HomeLibrary',
        text: 'J\'ai ajouté ce livre dans homelibrary '
          + this.book.selfRate !== undefined ? ' et je lui ai mi la note de ' + this.book.selfRate + '/5' : '',
        url: 'https://github.com/perretpy',
        dialogTitle: 'Share with HomeLibrary',
      });
    }
  }
}
</script>

<style scoped>
  .container {
    margin-top: 3em;
  }
  .book-cover {
    height: 100%;
    max-height: 30em;
  }
  .tag {
    margin-right: 1em;
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
</style>

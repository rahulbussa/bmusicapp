import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import * as jsmediatags from 'jsmediatags';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';


/*
  Generated class for the AudioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AudioProvider {
  _fileList: any[] = [];
  key: string = 'musicDB';
  dirList:any[] = [];
  constructor(public platform: Platform, private file: File, private storage: Storage) {
    console.log('Hello AudioProvider Provider');
    this.platform.ready().then(() => {
      jsmediatags.Config.setXhrTimeoutInSec(60000);
      this.storage.get(this.key).then(
        (value)=>{
              if(value){
                this._fileList = value;
              }
              else{
                  this.getData();
              }

        },
        (error) => {
          console.log(error);
          this.getData();
        }

      )

      
    });
  }

  readDir(){
    let noFolder=true;
    this.file.listDir(this.file.externalRootDirectory, '').then((result) => {
      for (let item of result) {
        if (item.isDirectory == true && item.name != '.' && item.name != '..') {
          noFolder = false;
          this.dirList.push(item.fullPath);
          let a = this.recDir(item.name);
          console.log("after a ");
        }
      }
      console.log("DONE***");
      if(noFolder){
        console.log(" DOne with recursion outside");
      }
    },
    (error) => {
      console.log(error);
    })
    
  }

  recDir(path){
    let noFolder=true;
    this.file.listDir(this.file.externalRootDirectory, path).then((result) => {
      let b;
      var that=this;
      result.forEach(function (item,i) {
        if (item.isDirectory == true && item.name != '.' && item.name != '..') {
          noFolder = false;
          that.dirList.push(item.fullPath);
          b = that.recDir(path+'/'+item.name);
        }
        console.log("End of for");
      })
      
      // for (let item of result) {
      //   if (item.isDirectory == true && item.name != '.' && item.name != '..') {
      //     noFolder = false;
      //     this.dirList.push(item.fullPath);
      //     b = this.recDir(path+'/'+item.name);
      //   }
      //   // console.log(b);
      // }  
      
      if(noFolder){
        console.log(" DOne with recursion");
      }
      console.log("***End of recursion***");
      return this.dirList;
      
      
    },
    (error) => {
      console.log(error);
    });
    // return this.dirList;
  }

  getData(){
    this.file.listDir(this.file.externalRootDirectory, '').then((result) => {
      for (let item of result) {
        if (item.isDirectory == true && item.name != '.' && item.name != '..') {
          this.getFileList(item.name);//Get all the files inside the folder. recursion will probably be useful here.
        }
        else if (item.isFile == true) {
          //File found
          if (item.name.indexOf('.mp3') != -1 && item.name.indexOf('AUD-') == -1 && item.name.indexOf('._') == -1) {
            jsmediatags.read(item.toInternalURL(), {
              onSuccess: (tags) => {
                console.log(tags);
                var tags = tags.tags;
                var image = tags.picture;
                var base64 = '';
                if (image) {
                  var base64String = "";
                  for (var i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                  }
                  base64 = "data:image/jpeg;base64," + window.btoa(base64String);
                }
                if (base64) {
                  this._fileList.push({
                    name: item.name,
                    path: item.nativeURL,
                    fullPath: item.fullPath,
                    inturl: item.toInternalURL(),
                    image: base64
                  });
                }
                else {
                  this._fileList.push({
                    name: item.name,
                    path: item.nativeURL,
                    fullPath: item.fullPath,
                    inturl: item.toInternalURL(),
                    image: './assets/imgs/music.jpg'
                  });
                }

              },
              onError: (error) => {
                console.log(error);
                this._fileList.push({
                  name: item.name,
                  path: item.nativeURL,
                  fullPath: item.fullPath,
                  inturl: item.toInternalURL(),
                  image: './assets/imgs/music.jpg'
                });

              }
            });

          }
        }
      }
      this.storage.set(this.key,this._fileList);
    },
      (error) => {
        console.log(error);
      })
  }

  public getFileList(path: string): any {
    let file = new File();
    this.file.listDir(file.externalRootDirectory, path)
      .then((result) => {
        for (let item of result) {
          if (item.isDirectory == true && item.name != '.' && item.name != '..') {
            this.getFileList(path + '/' + item.name);
          }
          else if (item.isFile == true) {
            if (item.name.indexOf('.mp3') != -1 && item.name.indexOf('AUD-') == -1 && item.name.indexOf('._') == -1) {
              jsmediatags.read(item.toInternalURL(), {
                onSuccess: (tags) => {
                  console.log(tags);
                  var tags = tags.tags;
                  var image = tags.picture;
                  var base64 = '';
                  if (image) {
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                      base64String += String.fromCharCode(image.data[i]);
                    }
                    base64 = "data:image/jpeg;base64," + window.btoa(base64String);
                  }
                  if (base64) {
                    this._fileList.push({
                      name: item.name,
                      path: item.nativeURL,
                      fullPath: item.fullPath,
                      inturl: item.toInternalURL(),
                      image: base64
                    });
                  }
                  else {
                    this._fileList.push({
                      name: item.name,
                      path: item.nativeURL,
                      fullPath: item.fullPath,
                      inturl: item.toInternalURL(),
                      image: './assets/imgs/music.jpg'
                    });
                  }

                },
                onError: (error) => {
                  console.log(error);
                  this._fileList.push({
                    name: item.name,
                    path: item.nativeURL,
                    fullPath: item.fullPath,
                    inturl: item.toInternalURL(),
                    image: './assets/imgs/music.jpg'
                  });

                }
              });
            }
          }
        }
      }, (error) => {
        console.log(error);
      })

      this.storage.set(this.key,this._fileList);
      
  }

  getPlaylist(){
    return this._fileList;
  }

}

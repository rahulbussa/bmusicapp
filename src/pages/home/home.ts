import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AudioProvider } from '../../providers/audio/audio';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import * as jsmediatags from 'jsmediatags';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  _fileList: any[] = [];
  key: string = 'musicDB';
  player: any={};
  cursrc = '';
  index = 0;
  playIcon = 'play';
  range = 0;
  defaultImg = './assets/imgs/music.jpg';
  currentContext: any;
  showLoader=false;
  canvas:any;
  showSlider=false;
  constructor(public navCtrl: NavController, public platform: Platform, private audio: AudioProvider, private storage: Storage,private file: File) {

    this.platform.ready().then(() => {
      console.log("Home");
      this.storage.get('musicDB').then((data) => {

        if (data) {
          if(Array.isArray(data)){
            if(data.length){
              this._fileList = data;
              console.log(this._fileList);
            }
            else{
              //this.audio.getData();
              //  this.audio.readDir();
              this.getData();
            }
          }
          
        }
        else {
          //this.audio.getData();
          //  this.audio.readDir();
          this.getData();
        }
      },
        (error) => {
          console.log(error);
          // this.audio.getData();
          this.getData();
        })
    })
  }

  getData(){
    this.showLoader=true;
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
      // this.storage.set(this.key,this._fileList);
      this.showLoader=false;
    },
      (error) => {
        console.log(error);
      })
  }

  public getFileList(path: string): any {
    let file = new File();
    this.showLoader=true;
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
        this.showLoader=false;
        this.storage.set(this.key,this._fileList);
      }, (error) => {
        console.log(error);
      })

      
      
  }



  ionViewDidLoad() {
    this.player = document.getElementById('video');
    this.canvas = document.getElementById('c');
    this.player.onended =  ()=>{
      console.log("on song end");
      
      this.songOnEnd();
     }

    if (this._fileList.length) {
      //this.cursrc = this._fileList[this.index].path;
      this.player.setAttribute('src', this._fileList[this.index].path);
    }
    /*
    // Canvas part
    const ctx = this.canvas.getContext('2d'),
    //W = window.innerWidth,
    //H = window.innerHeight,
    W = 300,
    H = 80,
    particles = 100,
    wind =2,
    holder = [],
    handler ='',
    colors = ['#2f5e70','#7fb2f1','#4f7ac8','#34478c','#16193c'],
    emitter = {x:W/2,y:H};
    
    // this.canvas.width = W;
    // this.canvas.height = H;
    //ctx.fillRect(0,0,W,H);
    function Particle(pos){
      this.x = pos.x;
      this.y = pos.y;
      this.r = Math.round(Math.random()*1.5);
      this.life = Math.round(Math.random()*10000);
      this.vy = (Math.random()>0.5)?Math.random()/2:-Math.random()/2;
      this.traction = Math.round(Math.random()*wind-3);
    }
    
    function create(){
      holder.push(new Particle({x:emitter.x,y:emitter.y}));
    }
    
    function draw(){
      var i = 50;
      while(i--){
        create(); 
      }
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#1b1f2b';
      ctx.fillRect(0,0,W,H);
      
      
      var partNum = holder.length;
      for(var i =0;i<partNum;i++){
        
        var temp = holder[i];
        if(temp === undefined)continue;
        
        ctx.fillStyle = findColor(temp.life);
        ctx.beginPath();
        ctx.arc(temp.x,temp.y,temp.r,0,Math.PI*2,true);
        ctx.fill();
        //temp.x -=wind-temp.traction;
        temp.x -= temp.vy;
        temp.life -=40;
        //temp.y -= temp.vy;
        temp.y -=wind-temp.traction; 
        if(temp ===undefined)console.log('un')
        if(temp.life < 0||temp.x<0){
          holder.splice(i,1);
        }
        
      }
      ctx.fillStyle = '#1867f7';
      ctx.arc(emitter.x,emitter.y,3,0,Math.PI*2,true);
      ctx.fill();
    }
    function initCanvas(){ 
      ctx.beginPath();
      ctx.arc(emitter.x,emitter.y,3,0,Math.PI*2,true);
      ctx.fill();
      const handler = setInterval(draw,40);
    }
    function findColor(life){
      if(life<2000){return colors[4];}
      else if(life<4000){return colors[3];}
      else if(life<6000){return colors[2];}
      else if(life<8000){return colors[1];}
      else{return colors[0];}
    }
    initCanvas();
    const context =  new (window["AudioContext"] || window["webkitAudioContext"])();
    */
  }

  songOnEnd(){
    // if (this._fileList) {
      this.range=0;
      if (this.index != this._fileList.length - 1) {
        this.index = this.index + 1;
      }
      else {
        this.index = 0;
      }
      this.player.setAttribute('src', this._fileList[this.index].path);
      this.player.play()
      this.currentContext = this._fileList[this.index];
    // }
  }


  play() {
    var src = this.player.src;
    if (src != 'file:///android_asset/www/index.html') {
      if (src && this.playIcon == 'play') {
        this.player.play();
        this.playIcon = 'pause';
      }
      else if (src && this.playIcon == 'pause') {
        this.player.pause();
        this.playIcon = 'play';
      }
      else {
        this.player.setAttribute('src', this._fileList[this.index].path);
      }
    }
    else {
      this.player.setAttribute('src', this._fileList[this.index].path);
      this.player.play();
      this.playIcon = 'pause';
    }
    this.player.addEventListener('timeupdate', this.updateProgressBar, false);
    this.defaultImg = './assets/imgs/music.jpg';
    this.currentContext = this._fileList[this.index];

  }

  back() {

    this.player.pause();
    if (this.index) {
      this.index = this.index - 1;
      //this.cursrc = this._fileList[this.index].path;
      this.player.setAttribute('src', this._fileList[this.index].path);
      this.range = 0;

    }
    this.player.play();
    this.currentContext = this._fileList[this.index];
  }

  front() {

    this.player.pause();
    if (this.index < this._fileList.length - 1) {
      this.index = this.index + 1;
      //this.cursrc = this._fileList[this.index].path;
      this.player.setAttribute('src', this._fileList[this.index].path);
      this.range = 0;
    }
    this.player.play();
    this.currentContext = this._fileList[this.index];
  }

  getCurrentSongName() {
    return this._fileList[this.index].name;
  }

  updateProgressBar() {
    try {
      if (this.player) {
        const duration = this.player.duration;
        const percentage = Math.floor((100 / duration) * this.player.currentTime);
        // Update the progress bar's value
        this.range = percentage;
        if (!this.player.paused) {
          window.requestAnimationFrame(this.updateProgressBar);
        } else {
          window.cancelAnimationFrame(0);
        }
      }  
    } catch (error) {
      console.log(error);
    }
    

    // Update the progress bar's text (for browsers that don't support the progress element)
    // progressBar.innerHTML = percentage + '% played';
  }

  changeTime(event: any){
    const val = event.value;
    console.log(val);
    const tps = this.player.duration / 100;
    this.player.currentTime = Math.floor(val * tps);
    // this.player.seekTo(event.value);
  }

  getDuration(){
    if(this.player){
      if(this.player.duration){
        const time = this.player.duration;
        const int = Math.floor(time),
        mins = Math.floor(int / 60),
        secs = int % 60,
        newTime = mins + ':' + ('0' + secs).slice(-2);
  
        return newTime;
        // const minutes = (this.player.duration / 60).toFixed(0);
        // const seconds = (this.player.duration % 60).toFixed(0);
        // // +":"+seconds.toFixed(2);
        // return minutes+":"+seconds;
      }
      else{
        return '0:00'
      }
      
    }
    else{
      return '0:00';
    }
  }

  showVol(){
    this.showSlider=true;
  }
}

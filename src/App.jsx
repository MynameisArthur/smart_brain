import React,{Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';


const app = new Clarifai.App({
  apiKey: '66cb67afd8414090bbd08ce84d38ee70'
 });

const particlesOptions = {
  particles: {
    line_linked: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 80
        }
      }
    }
  }
};

class App extends Component {
  constructor()
  {
    super();
    this.state = {
      input: '',
      imgUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    };
  }
  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;   
    const image = document.getElementById('inputimage');
    const width = Number(image.width); 
    const height = Number(image.height); 
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };    
  }
  displayFaceBox = (box)=>{
    console.log(box);    
    this.setState({box});
  }


  onInputChange = (event)=>{
   this.setState({input: event.target.value});   
  }
  onButtonSubmit = ()=>{
    this.setState({imgUrl: this.state.input});
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))    
    .catch(err=>console.log(err)); 
  }
  onRouteChange = (route)=>{
    if(route==='signout')
    {
      this.setState({isSignedIn: false});
    }
    else if(route==='home')
    {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }
  render()
  {
    const {isSignedIn,imgUrl,route,box} = this.state;
    return (
      <div className="App">
        <Particles 
          className="particles"
          params={particlesOptions} 
        />
       <Navigation 
       isSignedIn={isSignedIn}
       onRouteChange={this.onRouteChange} 
       />
        { (route === 'home') 
          ? (
            <>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imgUrl={imgUrl} box={box} />
            </>
            ) :
          ( this.state.route === 'signin' ? <Signin onRouteChange={this.onRouteChange}/> : <Register onRouteChange={this.onRouteChange}/>
          ) 
        }    
      </div>
    );
  }
}

export default App;
//https://a1-images.myspacecdn.com/images02/123/8df5422bfbca4a2d93ee84c1ca6a5360/full.jpg
//https://d1qsx5nyffkra9.cloudfront.net/sites/default/files/article-image/eminence-organics-acne-face-mapping.jpg
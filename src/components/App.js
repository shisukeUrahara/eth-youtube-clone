import React, { Component } from 'react';
import DYoutube from '../abis/DYoutube.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    const accounts = await web3.eth.getAccounts();
    console.log("**@ accounts are , ",accounts);
    //Add first account the the state
    this.setState({account:accounts[0]});

    //Get network ID
    const networkId  = await web3.eth.net.getId();
    const networkData= await DYoutube.networks[networkId];
    console.log("**@ id is , ",networkId);
    console.log("**@ networkData is , ",networkData);
    //Get network data
    //Check if net data exists, then
    let dyoutube;
    if(networkData){
      dyoutube = new web3.eth.Contract(DYoutube.abi,networkData.address);
      this.setState({dyoutube})
    }
    else {
      window.alert('DYoutube Contract has not been deployed to current network')
    }
      //Assign dvideo contract to a variable
      //Add dvideo to the state

      //Check videoAmounts
      const videosCount = await dyoutube.methods.videoCount().call();
      this.setState({videosCount})
      //Add videAmounts to the state

      //Iterate throught videos and add them to the state (by newest)
      for(let i=0;i<videosCount;i++){
       const videos=await dyoutube.methods.videos(i).call();
       this.setState({videos:[...this.state.videos,videos]})
      }


      //Set latest video and it's title to view as default 
      //Set loading state to false
      const latestVideo= await dyoutube.methods.videos(videosCount).call();
      this.setState({
        currentHash:latestVideo.hash,
        currentTitle:latestVideo.title
      })

      this.setState({loading:false});

      //If network data doesn't exisits, log error
  }

  //Get video
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  //Upload video
  uploadVideo = async title => {
  console.log("**@ Submitting file to IPFS with title , ",title);

  // adding file to IPFS
  ipfs.add(this.state.buffer,(err,result)=>{

    if(err){
     console.log("**@ IPFS upload error , ",err);
     return;
    }
    else{
    console.log("**@ IPFS upload success  result is , ",result);
    this.setState({loading:true});

    // save the hash on blockchain
     this.state.dyoutube.methods.uploadVideo(result[0].hash,title)
   .send({from:this.state.account})
   .on("transactionHash",(txHash)=>{
    this.setState({loading:false});

   })

    }
  })

  }

  //Change Video
  changeVideo = (hash, title) => {
  this.setState({currentHash:hash});
  this.setState({currentTitle:title});
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      account:'',
      buffer:null,
      dyoutube:null,
      videos:[],
      currentHash:null,
      currentTitle:null,
      videosCount:0
      //set states,'

    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar 
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
              captureFile={this.captureFile}
              uploadVideo={this.uploadVideo}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
              videos={this.state.videos}
              changeVideo={this.changeVideo}
            />
        }
      </div>
    );
  }
}

export default App;
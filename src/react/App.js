import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { channels } from '../shared/constants';
import MainWindow from './containers/MainWindow'
const { ipcRenderer } = window 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      appVersion: '',
    };
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      //const { appName, appVersion, folderPath } = arg;
      //this.setState({ appName, appVersion, folderPath });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" style={{backgroundColor: "#2D142C"}}>
        <MainWindow/>
        </header>
      </div>
    );
  }
}

export default App;

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //React Bootstrap
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css';//Font Awesome
import { ToastContainer } from 'react-toastify'; //React Toastify
import 'react-toastify/dist/ReactToastify.css';

import ViewAudience from './components/ViewAudience/ViewAudience';

function App() {
  return (
    <div className="App">
        <ViewAudience/>

        <div>
          <ToastContainer />
        </div>
    </div>
  );
}

export default App;

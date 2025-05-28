import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store'; // Adjust the path to your store file
import { name as appName } from './app.json';

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => Root);

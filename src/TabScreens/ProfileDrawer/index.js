import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import Profile from './Profile';

const MyDrawerNavigator = createDrawerNavigator(
  {
    Profile: {
      screen: Profile,
    },
  },
  {drawerPosition: 'right'},
);

export default createAppContainer(MyDrawerNavigator);

import TabScreens from '../TabScreens';
import PlaceDetail from './PlaceDetail';

import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

export default AppStack = createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: TabScreens,
      },
      PlaceDetail: {
        screen: PlaceDetail,
      },
    },
    {
      headerMode: 'none',
    },
  ),
);

import React, {Fragment, useEffect} from 'react';
import {View, FlatList, TextInput, Button, TouchableOpacity, StyleSheet} from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
const GiphySearch = ({query, onSearch, search, search_results, onPick}) => {
  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.input_container}>
          <TextInput style={styles.text_input} onChangeText={onSearch} value={query} placeholder="Search for gifs" />
        </View>

        <View style={styles.button_container}>
          <Button title="Search" color="#0064e1" onPress={search} />
        </View>
      </View>
      {search_results && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={search_results}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  onPick(item.url);
                }}>
                <View>
                  <ImageLoad
                    onError={e => alert(e)}
                    resizeMode={'contain'}
                    style={styles.image}
                    source={{uri: item.url}}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.list}
        />
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  input_container: {
    flex: 2,
  },
  text_input: {
    height: 35,
    marginTop: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#eaeaea',
    padding: 5,
  },
  button_container: {
    flex: 1,
    marginTop: 5,
  },
  list: {
    justifyContent: 'space-around',
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default GiphySearch;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import { addNote } from '../components/Database';

const InputScreen = ({ navigation }) => {
  const [note, setNote] = useState('');

  const insertData = () => {
    if (note !== '') {
      addNote(note);
      navigation.navigate('home');
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerNav}>
        <View style={[styles.headerNavBar, { paddingLeft: 6 }]}>
          <Pressable onPress={() => navigation.navigate('home')} style={styles.btnSquare}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={'#e0a314'} />
          </Pressable>
        </View>
        <Text style={styles.headerNavTitle}>Add Note</Text>
        <View style={[styles.headerNavBar, { paddingRight: 6 }]}>
          <Pressable onPress={() => insertData()} style={styles.btnSquare}>
            <FontAwesomeIcon icon={faCheck} size={18} color={'#e0a314'} />
          </Pressable>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={[styles.searchView, { flex: 1 }]}>
          <TextInput
            style={styles.inputSearchMulti}
            placeholderTextColor={'#999'}
            multiline={true}
            onChangeText={(text) => setNote(text)}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0F1F3'
  },
  headerNav: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ededed',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cbcbcb'
  },
  headerNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerNavTitle: {
    color: '#000000',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    marginTop: -1,
    letterSpacing: 0.3,
  },
  btnSquare: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  searchView: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  inputSearch: {
    minHeight: 36,
    paddingHorizontal: 8,
    paddingVertical: 0,
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
    color: '#353535'
  },
  inputSearchMulti: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
    textAlignVertical: 'top',
    fontFamily: 'Roboto-Regular',
    color: '#353535'
  },
});

export default InputScreen;
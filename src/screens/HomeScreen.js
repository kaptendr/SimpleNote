import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, TextInput, StatusBar, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import Card from '../components/Card';
import Modal from 'react-native-modal';
import { getAllNotes, deleteNote } from '../components/Database';

const HomeScreen = ({ navigation }) => {

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [masterData, setMasterData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [marked, setMarked] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const scaleAnimate = useRef(new Animated.Value(46)).current;
  const isFocused = useIsFocused();

  const toggleModal = (id) => {
    setIsModalVisible(!isModalVisible);
    setMarked(id);
  }

  useEffect(() => {
    setFilteredData(getAllNotes());
    setMasterData(getAllNotes());
    setSearch('');
  }, [isFocused]);

  const searchFilter = (text) => {
    if (text) {
      const newData = masterData.filter(
        function (item) {
          const itemData = item.desc
            ? item.desc.toUpperCase()
            : ' '.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      );
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(masterData);
      setSearch(text);
    }
  }

  const changeMode = () => {
    let now = !editMode;
    if (now === false) {
      setSelectedList([]);
      animateElement(46);
    } else {
      animateElement(0);
    }
    setEditMode(now);
  }

  const animateElement = (value) => {
    Animated.timing(scaleAnimate, {
      toValue: value,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  const animationStyle = {
    transform: [{ translateY: scaleAnimate }]
  }

  const editSelected = (id) => {
    if (selectedList.includes(id)) {
      setSelectedList(prevLists => prevLists.filter(itemId => itemId !== id));
    } else {
      setSelectedList(prevLists => [...prevLists, id]);
    }
  }

  const selectAll = () => {
    if (selectedList.length == filteredData.length) {
      setSelectedList([]);
    } else {
      setSelectedList(filteredData.map(x => x.id));
    }
  }

  const ModalContent = () => {
    return (
      <View>
        <View style={styles.delHeader}>
          <Text style={styles.delText}>{selectedList.length > 0 ? `Delete the ${selectedList.length} memos?` : 'Delete this memo?'}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => goDelete()} style={styles.delButton}>
            <Text style={styles.delText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleModal()} style={styles.delButton}>
          <Text style={styles.delText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const goDelete = () => {
    if (editMode) {
      for (let i = 0; i < selectedList.length; i++) {
        deleteNote(selectedList[i]);
      }
      setSelectedList([]);
      setEditMode(false);
      animateElement(46);
    } else {
      deleteNote(marked);
      setMarked(0);
    }
    setIsModalVisible(!isModalVisible);
    setFilteredData(getAllNotes());
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor={'#ededed'} barStyle='dark-content' />
      <View style={styles.headerNav}>
        <View style={[styles.headerNavBar, { paddingLeft: 6 }]}>
          {editMode ?
          <Pressable style={styles.btnSquare} onPress={() => selectAll()}>
            <Text style={{ color: '#e0a314' }}>{selectedList.length == filteredData.length ? 'None' : 'All'}</Text>
          </Pressable>
          :
          <Pressable style={styles.btnSquare} onPress={() => changeMode()}>
            <Text style={{ color: '#e0a314' }}>Edit</Text>
          </Pressable>
          }
        </View>
        <View style={styles.headerNavBar}>
          <Text style={styles.headerNavTitle}>Notes</Text>
        </View>
        <View style={[styles.headerNavBar, { paddingRight: 6 }]}>
          {editMode ?
          <Pressable style={styles.btnSquare} onPress={() => changeMode()}>
            <Text style={{ color: '#e0a314' }}>Cancel</Text>
          </Pressable>
          :
          <Pressable onPress={() => navigation.navigate('input')} style={styles.btnSquare}>
            <FontAwesomeIcon icon={faPlus} size={18} color={'#e0a314'} />
          </Pressable>
          }
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.searchView}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={14} color={'#929292'} />
          <TextInput
            style={styles.inputSearch}
            placeholder="Search for Memos"
            placeholderTextColor={'#acacac'}
            autoCapitalize="none"
            returnKeyType='search'
            value={search}
            onChangeText={(field) => searchFilter(field)}
          />
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={filteredData}
          refreshing={true}
          renderItem={({item}) => ( <Card data={item} toggleModal={toggleModal} editMode={editMode} editSelected={editSelected} selectedList={selectedList} /> )}
          onEndReachedThreshold={0.1}
        />
      </View>
      <Modal
        transparent={true}
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        animationOutTiming={600}
        useNativeDriver={true}
        backdropOpacity={0.2}
        avoidKeyboard={true}
        onBackdropPress={() => toggleModal()}>
        <View style={styles.alertBox}>
          <View style={styles.androidAlertBox}>
            <ModalContent />
          </View>
        </View>
      </Modal>
      <Animated.View style={[animationStyle, { position: 'absolute', width: '100%', bottom: 0 }]}>
        <TouchableOpacity onPress={() => toggleModal()} style={styles.delButton} disabled={selectedList.length > 0 ? false : true}>
          <Text style={[styles.delText, { color: selectedList.length > 0 ? '#e0a314' : '#e2d1a5' }]}>Delete{selectedList.length > 0 ? `(${selectedList.length})` : ''}</Text>
        </TouchableOpacity>
      </Animated.View>
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
    minWidth: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1
  },
  searchView: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    marginHorizontal: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cbcbcb'
  },
  inputSearch: {
    flex: 1,
    height: 32,
    padding: 0,
    paddingHorizontal: 8,
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
  },
  alertBox: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  androidAlertBox: {
    backgroundColor: '#e5e7ea',
    width: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  delText: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#353535',
    fontSize: 16
  },
  delButton: {
    height: 46,
    justifyContent: 'center',
    borderTopColor: '#c6cbd2',
    borderTopWidth: 1
  },
  delHeader: {
    height: 46,
    justifyContent: 'center',
    backgroundColor: '#f1f1f1'
  }
});

export default HomeScreen;
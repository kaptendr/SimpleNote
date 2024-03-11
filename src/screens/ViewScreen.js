import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, TouchableOpacity, StatusBar, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCheck, faShareNodes, faTrashCan, faFileExport, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getFileName } from '../components/GlobalFunction';
import { updateNote, deleteNote } from '../components/Database';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const ViewScreen = ({ navigation, route }) => {

  const [id, setId] = useState(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('view');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }

  const editData = () => {
    updateNote(id, note);
    navigation.navigate('home');
  }

  const getTime = (mako) => {
    let timeA = mako.getHours();
    let timeAF = timeA % 12;
    let timeB = mako .getMinutes();
    let timeBF = (timeB < 10) ? '0' + timeB : timeB;
    let timeC = timeA >= 12 ? 'PM' : 'AM';

    return timeAF + ':' + timeBF + ' ' + timeC;
  }

  useEffect(() => {
    setId(route.params.id);
    setNote(route.params.desc);
    
    let dateinput = new Date(route.params.date);
    let monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const datealpha = monthList[dateinput.getMonth()] + ' ' + dateinput.getDate() + ', ' + getTime(dateinput) + ' ' + dayList[dateinput.getDay()];
    setDate(datealpha);
  }, []);

  const goDelete = (id) => {
    if (id !== undefined) {
      toggleModal();
      deleteNote(id);
      navigation.navigate('home');
    }
  }

  const ModalContent = () => {
    return (
      <View>
        <View style={styles.delHeader}>
          <Text style={styles.delText}>Delete this memo?</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => goDelete(id)} style={styles.delButton}>
            <Text style={styles.delText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleModal()} style={styles.delButton}>
          <Text style={styles.delText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const share = async (customOptions = options) => {
    try { await Share.open(customOptions); }
    catch (err) { console.log(err); }
  }

  const startShare = async () => {
    let pesan = note;
    await share({
      title: 'Share Memo',
      message: pesan,
    })
  }

  const textToFile = async () => {
    const fileName = getFileName();
    const fileContent = note;
    const filePath = RNFS.DocumentDirectoryPath + '/' + fileName;
    
    try {
      await RNFS.writeFile(filePath, fileContent, 'utf8');
      console.log('written to file');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar backgroundColor={'#ededed'} barStyle='dark-content' />
      <View style={styles.headerNav}>
        <View style={[styles.headerNavBar, { paddingLeft: 6 }]}>
          <Pressable onPress={() => navigation.navigate('home')} style={styles.btnSquare}>
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={'#e0a314'} />
          </Pressable>
        </View>
        <Text style={styles.headerNavTitle}>{mode == 'view' ? 'View' : 'Edit'}</Text>
        <View style={[styles.headerNavBar, { paddingRight: 6 }]}>
          {mode == 'edit' ?
          <Pressable onPress={() => editData()} style={styles.btnSquare}>
            <FontAwesomeIcon icon={faCheck} size={18} color={'#e0a314'} />
          </Pressable>
          :
          <Pressable onPress={() => navigation.navigate('input')} style={styles.btnSquare}>
            <FontAwesomeIcon icon={faPlus} size={18} color={'#e0a314'} />
          </Pressable>
          }
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={[styles.searchView, { flex: 1 }]}>
          <TextInput
            style={styles.inputSearchMulti}
            placeholder="Description"
            placeholderTextColor={'#999'}
            multiline={true}
            autoCorrect={false}
            onFocus={() => setMode('edit')}
            onChangeText={(text) => setNote(text)}
            value={note}
          />
        </View>
      </View>
      <View style={{ backgroundColor: '#ffffff' }}>
        <View style={{ paddingTop: 6, opacity: (mode == 'view') ? 1 : 0 }}>
          <Text style={styles.utxDateText}>{date}</Text>
        </View>
        <View style={styles.utxBar}>
          <TouchableOpacity activeOpacity={0.5} style={styles.utxButton} onPress={() => [startShare(), Keyboard.dismiss()]}>
            <FontAwesomeIcon icon={faShareNodes} size={18} color={'#e0a314'} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={styles.utxButton} onPress={() => textToFile()}>
            <FontAwesomeIcon icon={faFileExport} size={18} color={'#e0a314'} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={styles.utxButton} onPress={() => toggleModal()}>
            <FontAwesomeIcon icon={faTrashCan} size={18} color={'#e0a314'} />
          </TouchableOpacity>
        </View>
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
  inputSearchMulti: {
    flex: 1,
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
    textAlignVertical: 'top',
    fontFamily: 'Roboto-Regular',
    color: '#353535',
    lineHeight: 22
  },
  utxDateText: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#999'
  },
  utxBar: {
    flexDirection: 'row',
    height: 36
  },
  utxButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});

export default ViewScreen;
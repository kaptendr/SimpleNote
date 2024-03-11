import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const Card = (props) => {

  const { toggleModal, data, editMode, editSelected, selectedList } = props;
  const { id, title, desc, date } = data;
  const scaleAnimate = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (editMode) {
      animateElement(40);
    } else {
      animateElement(0);
    }
  }, [editMode]);

  const animateElement = (value) => {
    Animated.timing(scaleAnimate, {
      toValue: value,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  const animationStyle = {
    width: scaleAnimate
  }

  const getTime = () => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let strdate = day + '/' + month + '/' + year;

    let newDate = new Date();
    let newDay = newDate.getDate();
    let newMonth = newDate.getMonth() + 1;
    let newYear = newDate.getFullYear();
    let newStrdate = newDay + '/' + newMonth + '/' + newYear;
    
    if (year === newYear) {
      if (strdate === newStrdate) {
        let timeA = date.getHours();
        let timeAF = timeA % 12;
        let timeB = date.getMinutes();
        let timeBF = (timeB < 10) ? '0' + timeB : timeB;
        let timeC = timeA >= 12 ? 'PM' : 'AM';

        return timeAF + ':' + timeBF + ' ' + timeC;
      } else {
        return day + '/' + month;
      }
    } else {
      return day + '/' + month+ '/' + year;
    }
  }

  const getTitle = (val) => {
    var string = val;
    return string.split("\n", 1)[0];
  }

  const goToView = () => {
    navigation.navigate('view', {
      id: id,
      title: title,
      desc: desc,
      date: date.toISOString(),
    });
  }

  const verifyMode = () => {
    if (editMode) {
      editSelected(id);
    } else {
      goToView();
    }
  }

  return (
    <TouchableOpacity activeOpacity={0.5} style={styles.cardView} onPress={() => verifyMode()} onLongPress={() => toggleModal(id)}>
      <Animated.View style={[animationStyle, { overflow: 'hidden' }]}>
        <View style={{ paddingLeft: 18 }}>
          {selectedList.includes(id) ?
          <FontAwesomeIcon icon={faCircleCheck} size={16} color={'#2899f7'} />
          :
          <FontAwesomeIcon icon={faCircle} size={16} color={'#d0d0d0'} />
          }
        </View>
      </Animated.View>
      <View style={styles.topNote}>
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <Text style={styles.headerNote} numberOfLines={1}>{getTitle(desc)}</Text>
        </View>
        <Text style={styles.textNote}>{getTime(date)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  topNote: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 18,
    paddingRight: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#dddddd'
  },
  headerNote: {
    color: '#414141',
    fontFamily: 'Roboto-Regular'
  },
  textNote: {
    color: '#404040',
    marginLeft: 18,
    fontFamily: 'Roboto-Regular',
    fontSize: 12
  }
});

export default Card;
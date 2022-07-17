/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button } from 'react-native-paper';

import { Text, Divider } from '../common';

import { COLORS, rh, rw } from '../../configs';
import { useIsPeriodDay } from '../../libs/hooks';

const PsychologyTestDetail = ({
  testDetails,
  handleTestAnswers,
  resetState,
}) => {
  const isPeriodDay = useIsPeriodDay();
  const [selectedOption, setSelectedOption] = useState(new Map([]));

  const handleSelectedChoices = function (answer) {
    const answers = new Map([...selectedOption]);
    if (answers.size === 0) {
      answers.set(answer.question_id, { oId: answer.id });
      setSelectedOption(answers);
      handleTestAnswers(answers);
      return;
    }
    if (answers.has(answer.question_id)) {
      answers.delete(answer.question_id);
      answers.set(answer.question_id, { oId: answer.id });
    } else {
      answers.set(answer.question_id, { oId: answer.id });
    }
    setSelectedOption(answers);
    handleTestAnswers(answers);
  };

  const RenderQuestions = function ({ item }) {
    return (
      <View
        style={{
          flexShrink: 1,
          paddingHorizontal: rw(4),
          borderWidth: 1,
          paddingVertical: rh(2),
          marginVertical: 10,
          width: '90%',
          alignSelf: 'center',
          borderRadius: 5,
        }}>
        <Text small textAlign="right" alignSelf="flex-end">
          {item.question}
        </Text>
        {item.options.map((op) => {
          return (
            <Button
              mode={
                selectedOption.has(op.question_id) &&
                selectedOption.get(op.question_id).oId === op.id
                  ? 'contained'
                  : 'outlined'
              }
              color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
              style={styles.btn}
              onPress={() => handleSelectedChoices(op)}>
              <Text
                color={
                  selectedOption.has(op.question_id) &&
                  selectedOption.get(op.question_id).oId === op.id
                    ? COLORS.white
                    : COLORS.pink
                }>
                {op.title}
              </Text>
            </Button>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text marginTop={rh(4)} medium bold>
        {testDetails.title}
      </Text>
      <Divider
        color={isPeriodDay ? COLORS.rossoCorsa : COLORS.pink}
        width="90%"
        style={{ marginTop: 10 }}
      />
      <FlatList
        data={testDetails.questions}
        keyExtractor={(item) => item.id}
        renderItem={RenderQuestions}
        style={{ marginTop: 20, width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '80%',
    height: 40,
    margin: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cardContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },
  cardBtn: {
    width: '30%',
    height: 30,
    borderRadius: 30,
    justifyContent: 'center',
    marginLeft: 5,
  },
});

export default PsychologyTestDetail;

/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { Text } from '../../../../components/common';

import { COLORS, rh, rw } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

const PsychologyTestDetail = ({
  testDetails,
  handleTestAnswers,
  resetState,
  isFocused,
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
          borderTopWidth: 1,
          borderTopColor: COLORS.icon,
          paddingVertical: rh(1),
          marginVertical: 5,
          width: '80%',
          alignSelf: 'center',
          borderRadius: 5,
        }}>
        <Text
          size={11}
          bold
          color={COLORS.textLight}
          textAlign="right"
          marginTop={rh(1)}
          marginBottom={rh(1)}
          marginRight={rw(1.5)}
          alignSelf="flex-end">
          {item.question}
        </Text>
        {item.options.map(op => {
          return (
            <View style={styles.checkBoxContainer}>
              <Text
                size={11}
                textAlign="right"
                color={
                  selectedOption.has(op.question_id) &&
                  selectedOption.get(op.question_id).oId === op.id
                    ? isPeriodDay
                      ? COLORS.periodDay
                      : COLORS.primary
                    : COLORS.textLight
                }>
                {op.title}
              </Text>
              <Checkbox
                uncheckedColor={COLORS.textLight}
                color={isPeriodDay ? COLORS.periodDay : COLORS.primary}
                status={
                  selectedOption.has(op.question_id) &&
                  selectedOption.get(op.question_id).oId === op.id
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => handleSelectedChoices(op)}
                theme={{}}
              />
            </View>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    setSelectedOption(new Map([]));
  }, [isFocused]);

  useEffect(() => {
    resetState && setSelectedOption(new Map([]));
  }, [resetState]);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text color={COLORS.textCommentCal} marginTop={rh(4)} size={13} bold>
        {testDetails.title}
      </Text>
      <View style={{ width: rw(85), marginBottom: rh(1) }}>
        <Text
          size={11}
          bold
          color={COLORS.textLight}
          marginRight="10"
          marginTop="5"
          textAlign="right">
          {testDetails.description
            ? testDetails.description.replace(/(<([^>]+)>)/gi, '')
            : ''}
        </Text>
      </View>
      <FlatList
        data={testDetails.questions}
        keyExtractor={item => item.id}
        renderItem={RenderQuestions}
        style={{ marginBottom: rh(2), width: '100%' }}
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
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 1,
    width: '100%',
    // marginTop: rh(0.5),
  },
});

export default PsychologyTestDetail;

/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { Text, Divider } from '../../../../components/common';

import { COLORS, rh, rw } from '../../../../configs';
import { useIsPeriodDay } from '../../../../libs/hooks';

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
          borderBottomWidth: 1,
          borderBottomColor: COLORS.icon,
          paddingVertical: rh(1),
          marginVertical: 5,
          width: '80%',
          alignSelf: 'center',
          borderRadius: 5,
        }}>
        <Text
          small
          color={COLORS.textLight}
          textAlign="right"
          marginBottom={rh(1)}
          marginRight={rw(1.5)}
          alignSelf="flex-end">
          {item.question}
        </Text>
        {item.options.map(op => {
          return (
            <View style={styles.checkBoxContainer}>
              <Text small color={COLORS.textLight}>
                {op.title}
              </Text>
              <Checkbox
                uncheckedColor={COLORS.textLight}
                color={COLORS.primary}
                // disabled={isLoading ? true : false}

                status={
                  selectedOption.has(op.question_id) &&
                  selectedOption.get(op.question_id).oId === op.id
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => handleSelectedChoices(op)}
              />
            </View>
            // <Button
            //   mode={
            //     selectedOption.has(op.question_id) &&
            //     selectedOption.get(op.question_id).oId === op.id
            //       ? 'contained'
            //       : 'outlined'
            //   }
            //   color={isPeriodDay ? COLORS.fireEngineRed : COLORS.primary}
            //   style={styles.btn}
            //   onPress={() => handleSelectedChoices(op)}>
            //   <Text
            //     color={
            //       selectedOption.has(op.question_id) &&
            //       selectedOption.get(op.question_id).oId === op.id
            //         ? COLORS.white
            //         : COLORS.primary
            //     }>
            //     {op.title}
            //   </Text>
            // </Button>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    setSelectedOption(new Map([]));
  }, [resetState]);

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text color={COLORS.textCommentCal} marginTop={rh(4)} siz2={11} bold>
        {testDetails.title}
      </Text>
      <View style={{ width: rw(85) }}>
        <Text
          size={10}
          color={COLORS.textLight}
          marginRight="10"
          // alignSelf="flex-end"
          marginTop="5"
          textAlign="right">
          {testDetails.description
            ? testDetails.description.replace(/(<([^>]+)>)/gi, '')
            : ''}
        </Text>
      </View>

      <Divider
        color={isPeriodDay ? COLORS.fireEngineRed : COLORS.textLight}
        width="80%"
        style={{ marginTop: rh(2) }}
      />
      <FlatList
        data={questions}
        keyExtractor={item => item.id}
        renderItem={RenderQuestions}
        style={{ marginTop: rh(1), width: '100%' }}
      />
    </View>
  );
};

const questions = [
  {
    created_at: 1661840335,
    id: 1,
    options: [
      {
        created_at: 1661840408,
        id: 1,
        question_id: 1,
        score: 1,
        title: 'کمی',
        updated_at: 1661840408,
      },
      {
        created_at: 1661840419,
        id: 2,
        question_id: 1,
        score: 2,
        title: 'متوسط',
        updated_at: 1661840419,
      },
      {
        created_at: 1661840428,
        id: 3,
        question_id: 1,
        score: 3,
        title: 'زیاد',
        updated_at: 1661840428,
      },
      {
        created_at: 1661840439,
        id: 4,
        question_id: 1,
        score: 4,
        title: 'خیلی زیاد',
        updated_at: 1661840439,
      },
    ],
    question:
      '1.نتدالزنتیبادنیتبا دمنستیبایبدمنتاردمنتسیا متنابمنت بلیرسیلزدنتساقبل ستنبذ مثنزب',
    test_id: 1,
    updated_at: 1661840335,
  },
  {
    created_at: 1661840347,
    id: 2,
    options: [
      {
        created_at: 1661840452,
        id: 5,
        question_id: 2,
        score: 0,
        title: 'هرگز',
        updated_at: 1661840452,
      },
      {
        created_at: 1661840462,
        id: 6,
        question_id: 2,
        score: 1,
        title: 'به ندرت',
        updated_at: 1661840462,
      },
      {
        created_at: 1661840472,
        id: 7,
        question_id: 2,
        score: 2,
        title: 'گاهی',
        updated_at: 1661840472,
      },
      {
        created_at: 1661840482,
        id: 8,
        question_id: 2,
        score: 3,
        title: 'اغلب',
        updated_at: 1661840482,
      },
    ],
    question:
      '2.ندتاسینبتازثق منتسلایبتسزلایذبدنزتسذیب متاذیبدزتسیذبدزنتسیبا تاذیبنزتاذیبنمت',
    test_id: 1,
    updated_at: 1661840347,
  },
];

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
    marginTop: rh(0.5),
  },
});

export default PsychologyTestDetail;

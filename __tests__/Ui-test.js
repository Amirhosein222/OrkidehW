import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../source/screens';

test('Render Login screen propely', () => {
  const { debug, getByText, getByTestId } = render(<LoginScreen />);
  const button = getByTestId('loginBtn');
  const onPress = jest.fn();
  fireEvent.press(onPress);
  expect(button).toHaveBeenCalled();
});

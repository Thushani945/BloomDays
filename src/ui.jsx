import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const color = {
  ink: '#252E25', muted: '#556254', green: '#214A36', lime: '#DDF48E',
  paper: '#F8F7EE', white: '#FFFFFF', line: '#E2E6DB', danger: '#A33139',
};

export function Button({ label, onPress, secondary, danger, disabled }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }}
      onPress={onPress} disabled={disabled}
      style={({ pressed }) => [s.button, secondary && s.secondary, pressed && s.pressed, disabled && s.pressed]}>
      <Text style={[s.buttonText, secondary && s.secondaryText, danger && { color: color.danger }]}>{label}</Text>
    </Pressable>
  );
}

export function Heading({ eyebrow, title, subtitle }) {
  return (
    <View style={s.heading}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.muted}>{subtitle}</Text> : null}
    </View>
  );
}

export function Empty({ title, children }) {
  return <View style={s.empty}><Text style={s.strong}>{title}</Text><Text style={s.muted}>{children}</Text></View>;
}

export const s = StyleSheet.create({
  heading: { gap: 5, marginBottom: 4 },
  eyebrow: { color: color.green, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: color.ink, fontSize: 38, fontWeight: '800', letterSpacing: -1.5 },
  muted: { color: color.muted, fontSize: 15, lineHeight: 22 },
  strong: { color: color.ink, fontSize: 17, fontWeight: '800' },
  section: { color: color.ink, fontSize: 21, fontWeight: '800' },
  button: { minHeight: 50, borderRadius: 16, backgroundColor: color.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  buttonText: { color: color.white, fontSize: 15, fontWeight: '800' },
  secondary: { backgroundColor: color.white, borderWidth: 1, borderColor: color.line },
  secondaryText: { color: color.green },
  pressed: { opacity: 0.65 },
  empty: { padding: 20, borderRadius: 20, backgroundColor: color.white, gap: 5 },
  input: { backgroundColor: color.white, borderColor: color.line, borderWidth: 1, borderRadius: 15, padding: 14, color: color.ink, fontSize: 16, minHeight: 50 },
});

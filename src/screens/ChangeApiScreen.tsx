import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import apiConstants from '../constants/API'; // Adjust the path as per your project structure
import { clearCache } from '../api/dataService';

const ChangeApiScreen = () => {
  const navigation = useNavigation<any>();
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('0E0VEHI4EEQBGP0W'); // Set default value

  useEffect(() => {
    const fetchApiKey = async () => {
      const apiKey = await apiConstants.getApiKey();
      if (apiKey !== 'demo' && apiKey !== null) {
        setUseCustomKey(true); // Set useCustomKey to true if apiKey is not 'demo' and not null
        setCustomApiKey(apiKey);
      } else {
        setUseCustomKey(false); // Set useCustomKey to false if apiKey is 'demo' or null
        setCustomApiKey('0E0VEHI4EEQBGP0W'); // Set default value
      }
    };

    fetchApiKey();
  }, []);

  const handleToggleSwitch = () => {
    setUseCustomKey(!useCustomKey);
    if (!useCustomKey) {
      setCustomApiKey('0E0VEHI4EEQBGP0W'); // Reset to default value when toggling on
    }
  };

  const handleSubmit = async () => {
    if (useCustomKey) {
      await apiConstants.setApiKey(customApiKey);
    } else {
      await apiConstants.resetToDemoApiKey();
    }
    console.log('Submitted API Key:', useCustomKey ? customApiKey : 'demo');
    clearCache(); 
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change API Key</Text>
      <Text style={styles.subtitle}>
        You can switch between the demo key (provided by AlphaVantage) which has limited endpoints with limited keywords but no limits OR you can use your own API key.
      </Text>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Use Custom API Key:</Text>
        <Switch
          value={useCustomKey}
          onValueChange={handleToggleSwitch}
          style={styles.switch}
        />
      </View>

      {useCustomKey && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Custom API Key"
            value={customApiKey}
            onChangeText={text => setCustomApiKey(text)}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
      {!useCustomKey && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 18,
    marginRight: 10,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#0abb92',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangeApiScreen;

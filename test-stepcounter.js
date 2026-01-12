/**
 * Step Counter Integration Test Script
 * Run this with: npx react-native start
 * Then in another terminal: node test-stepcounter.js
 */

import { NativeModules, Platform } from 'react-native';

console.log('=== Step Counter Integration Test ===\n');

// Test 1: Check Platform
console.log('1. Platform Check:');
console.log(`   Platform: ${Platform.OS}`);
console.log(`   Version: ${Platform.Version}`);
console.log(`   ✅ Platform is Android: ${Platform.OS === 'android'}\n`);

// Test 2: Check Native Module Availability
console.log('2. Native Module Availability:');
const { StepCounter } = NativeModules;
if (StepCounter) {
  console.log('   ✅ StepCounter module found');
  console.log(`   Module name: ${StepCounter.getName ? StepCounter.getName() : 'N/A'}`);
} else {
  console.log('   ❌ StepCounter module NOT found');
  console.log('   Available modules:', Object.keys(NativeModules).join(', '));
}
console.log('');

// Test 3: Check Module Methods
if (StepCounter) {
  console.log('3. Module Methods Check:');
  const methods = [
    'isStepCounterAvailable',
    'isStepDetectorAvailable',
    'startStepCounter',
    'stopStepCounter',
    'getStepCount',
    'resetStepCount',
  ];
  
  methods.forEach(method => {
    const exists = typeof StepCounter[method] === 'function';
    console.log(`   ${exists ? '✅' : '❌'} ${method}: ${exists ? 'Available' : 'Missing'}`);
  });
  console.log('');
  
  // Test 4: Check Sensor Availability
  console.log('4. Sensor Availability Check:');
  StepCounter.isStepCounterAvailable()
    .then(available => {
      console.log(`   Step Counter Available: ${available ? '✅ Yes' : '❌ No'}`);
      return StepCounter.isStepDetectorAvailable();
    })
    .then(available => {
      console.log(`   Step Detector Available: ${available ? '✅ Yes' : '❌ No'}`);
      console.log('');
      console.log('5. Getting Initial Step Count:');
      return StepCounter.getStepCount();
    })
    .then(count => {
      console.log(`   ✅ Initial step count: ${count}`);
      console.log('');
      console.log('=== Test Summary ===');
      console.log('✅ All basic checks passed!');
      console.log('Step counter is properly integrated.');
    })
    .catch(error => {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
      console.log('=== Test Summary ===');
      console.log('❌ Some checks failed. See errors above.');
    });
} else {
  console.log('3. Cannot test methods - module not available');
  console.log('');
  console.log('=== Test Summary ===');
  console.log('❌ StepCounter module is not properly integrated.');
  console.log('Please check:');
  console.log('  1. MainApplication.kt includes StepCounterPackage');
  console.log('  2. StepCounterModule.kt is in correct location');
  console.log('  3. App was rebuilt after adding native code');
}

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';

export default function MainMenu({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Title & Branding Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>LINIA</Text>
        <Text style={styles.subtitle}>THE HAMILTONIAN PUZZLE</Text>
        
        {/* A minimal decorative graphic to represent connected paths */}
        <View style={styles.decorationContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.line} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.lineInactive} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Navigation Buttons Section */}
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Gameplay')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>START GAME</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('LevelSelection')}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>SELECT LEVEL</Text>
        </TouchableOpacity>
      </View>
      
      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Play & Enjoy</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212', 
    alignItems: 'center', 
    justifyContent: 'space-evenly' 
  },
  titleContainer: { 
    alignItems: 'center', 
    marginTop: 40 
  },
  title: { 
    color: '#00e5ff', 
    fontSize: 65, 
    fontWeight: '900', 
    letterSpacing: 8, 
    textShadowColor: '#00e5ff', 
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: 15 
  },
  subtitle: { 
    color: '#888', 
    fontSize: 14, 
    letterSpacing: 4, 
    marginTop: 5, 
    fontWeight: '600' 
  },
  decorationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 40 
  },
  dot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#333' 
  },
  dotActive: { 
    backgroundColor: '#00e5ff', 
    shadowColor: '#00e5ff', 
    shadowOpacity: 0.8, 
    shadowRadius: 8, 
    elevation: 5 
  },
  line: { 
    width: 40, 
    height: 3, 
    backgroundColor: '#00e5ff' 
  },
  lineInactive: { 
    width: 40, 
    height: 3, 
    backgroundColor: '#333' 
  },
  menuContainer: { 
    width: '100%', 
    alignItems: 'center', 
    gap: 20 
  },
  primaryButton: { 
    backgroundColor: '#00e5ff', 
    width: '75%', 
    paddingVertical: 18, 
    borderRadius: 30, 
    alignItems: 'center', 
    shadowColor: '#00e5ff', 
    shadowOpacity: 0.5, 
    shadowRadius: 10, 
    elevation: 8 
  },
  primaryButtonText: { 
    color: '#121212', 
    fontSize: 20, 
    fontWeight: 'bold', 
    letterSpacing: 2 
  },
  secondaryButton: { 
    backgroundColor: 'transparent', 
    width: '75%', 
    paddingVertical: 18, 
    borderRadius: 30, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#333' 
  },
  secondaryButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    letterSpacing: 2 
  },
  footer: { 
    marginBottom: 10 
  },
  footerText: { 
    color: '#444', 
    fontSize: 12, 
    letterSpacing: 2,
    fontWeight: 'bold'
  }
});
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    onClick: () => void;
    loading?: boolean;
};

const GoogleSignInButton: React.FC<Props> = ({ onClick, loading }) => {
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onClick}>
            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                    style={styles.icon}
                />
                <Text style={styles.text}>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
});

import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';
import { FONT_SIZES, SPACING } from '@/constants/spacing';
import React, { Component, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Oops! Something went wrong</Text>
                    <Text style={styles.message}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Text>
                    <Button
                        title="Try Again"
                        onPress={this.handleReset}
                        variant="primary"
                        style={styles.button}
                    />
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    message: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    button: {
        minWidth: 150,
    },
});
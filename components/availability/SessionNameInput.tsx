import { Input } from '@/components/common/Input';
import { COLORS } from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZES, SPACING } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface SessionNameInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const PRESET_SESSIONS = [
    'PT',
    'Group Training',
    'Consultation',
    'Assessment',
    'Custom',
];

export const SessionNameInput: React.FC<SessionNameInputProps> = ({
    value,
    onChange,
    error,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const handleSelect = (session: string) => {
        if (session === 'Custom') {
            // Keep modal open for custom input
            return;
        }
        onChange(session);
        setShowModal(false);
    };

    const handleCustomSubmit = () => {
        if (customInput.trim()) {
            onChange(customInput.trim());
            setCustomInput('');
            setShowModal(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Session Name*</Text>

            <TouchableOpacity
                style={[styles.selector, error && styles.selectorError]}
                onPress={() => setShowModal(true)}
            >
                <Text style={[styles.value, !value && styles.placeholder]}>
                    {value || 'Select session type'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.gray[600]} />
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowModal(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Session Type</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={PRESET_SESSIONS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        value === item && styles.selectedOption,
                                    ]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            value === item && styles.selectedOptionText,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                    {value === item && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color={COLORS.primary}
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                        <View style={styles.customInputContainer}>
                            <Input
                                placeholder="Or enter custom name"
                                value={customInput}
                                onChangeText={setCustomInput}
                                onSubmitEditing={handleCustomSubmit}
                                returnKeyType="done"
                            />
                            <TouchableOpacity
                                style={styles.customButton}
                                onPress={handleCustomSubmit}
                                disabled={!customInput.trim()}
                            >
                                <Text style={styles.customButtonText}>Add Custom</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    selectorError: {
        borderColor: COLORS.error,
    },
    value: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    placeholder: {
        color: COLORS.gray[400],
    },
    error: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    selectedOption: {
        backgroundColor: COLORS.primary + '10',
    },
    optionText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.primary,
    },
    selectedOptionText: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    customInputContainer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    customButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    customButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useAuth } from '@/hooks/useAuth';

type FieldRowProps = {
  value:       string;
  onChange:    (val: string) => void;
  editable:    boolean;
  isPassword?: boolean;
  placeholder?: string;
};

function FieldRow({
  value,
  onChange,
  editable,
  isPassword = false,
  placeholder,
}: FieldRowProps) {
  return (
    <View style={[
      fieldStyles.wrapper,
      editable && fieldStyles.wrapperActive,
    ]}>
      <TextInput
        style={fieldStyles.input}
        value={value}
        onChangeText={onChange}
        editable={editable}
        secureTextEntry={isPassword}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.placeholder}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: {
    borderWidth:       1.5,
    borderColor:       Colors.border.default,
    borderRadius:      12,
    paddingHorizontal: 16,
    height:            52,
    justifyContent:    'center',
    backgroundColor:   Colors.background.default,
  },
  wrapperActive: {
    borderColor: Colors.border.focus,
  },
  input: {
    ...Typography.body,
    color:   Colors.text.primary,
    padding: 0,
  },
});

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon:    keyof typeof Ionicons.glyphMap;
  label:   string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={menuStyles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={menuStyles.label}>{label}</Text>
      <Ionicons name={icon} size={18} color={Colors.text.secondary} />
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  label: {
    ...Typography.body,
    color: Colors.text.primary,
  },
});

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, isLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [nama,      setNama]      = useState(user?.nama    ?? '');
  const [email,     setEmail]     = useState(user?.email   ?? '');
  const [alamat,    setAlamat]    = useState(user?.alamat  ?? '');
  const [password,  setPassword]  = useState('••••••••••');

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Yakin Mau Keluar Dari Akun Kamu?',
      [
        { text: 'Batal',  style: 'cancel' },
        {
          text:    'Keluar',
          style:   'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/start');
          },
        },
      ]
    );
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.primary.default} />

      <View style={[styles.headerBg, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.nama?.[0] ?? 'U').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.headerName}>{user?.nama ?? 'Pengguna'}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        <View style={styles.formCard}>
          <FieldRow
            value={nama}
            onChange={setNama}
            editable={isEditing}
            placeholder="Nama Lengkap"
          />
          <FieldRow
            value={email}
            onChange={setEmail}
            editable={isEditing}
            placeholder="Email"
          />
          <FieldRow
            value={alamat}
            onChange={setAlamat}
            editable={isEditing}
            placeholder="Alamat"
          />
          <FieldRow
            value={password}
            onChange={setPassword}
            editable={isEditing}
            isPassword={!isEditing}
            placeholder="Password"
          />
        </View>

        <View style={styles.menuCard}>
          <MenuItem
            icon="shield-checkmark-outline"
            label="Kebijakan Dan Privasi"
            onPress={() => {}}
          />
          <MenuItem
            icon="receipt-outline"
            label="Riwayat Order"
            onPress={() => {}}
          />
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnEdit}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isEditing ? 'checkmark-outline' : 'create-outline'}
              size={18}
              color={Colors.white}
            />
            <Text style={styles.btnEditText}>
              {isEditing ? 'Simpan' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnLogout, isLoading && { opacity: 0.65 }]}
            onPress={handleLogout}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.btnLogoutText}>Keluar</Text>
                <Ionicons name="log-out-outline" size={18} color={Colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.background.soft,
  },

  headerBg: {
    backgroundColor:   Colors.primary.default,
    paddingHorizontal: 20,
    paddingBottom:     40,
    alignItems:        'center',
    gap:               10,
  },
  settingsBtn: {
    alignSelf:  'flex-end',
    padding:    4,
    marginBottom: 8,
  },
  avatar: {
    width:           72,
    height:          72,
    borderRadius:    36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     'rgba(255,255,255,0.5)',
  },
  avatarText: {
    ...Typography.h2,
    color: Colors.white,
  },
  headerName: {
    ...Typography.h4,
    color: Colors.white,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop:        20,
    gap:               16,
    marginTop:         -20,
  },

  formCard: {
    backgroundColor: Colors.background.default,
    borderRadius:    16,
    padding:         16,
    gap:             12,
    shadowColor:     '#000',
    shadowOpacity:   0.05,
    shadowOffset:    { width: 0, height: 2 },
    shadowRadius:    6,
    elevation:       2,
  },

  menuCard: {
    backgroundColor:   Colors.background.default,
    borderRadius:      16,
    paddingHorizontal: 16,
    shadowColor:       '#000',
    shadowOpacity:     0.05,
    shadowOffset:      { width: 0, height: 2 },
    shadowRadius:      6,
    elevation:         2,
  },

  btnRow: {
    flexDirection: 'row',
    gap:           12,
  },
  btnEdit: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             8,
    backgroundColor: Colors.secondary.default,
    borderRadius:    12,
    paddingVertical: 14,
    shadowColor:     '#000',
    shadowOpacity:   0.12,
    shadowOffset:    { width: 0, height: 3 },
    shadowRadius:    6,
    elevation:       3,
  },
  btnEditText: {
    ...Typography.button,
    color: Colors.white,
  },
  btnLogout: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             8,
    backgroundColor: '#CC2F5E',
    borderRadius:    12,
    paddingVertical: 14,
    shadowColor:     '#CC2F5E',
    shadowOpacity:   0.3,
    shadowOffset:    { width: 0, height: 3 },
    shadowRadius:    6,
    elevation:       3,
  },
  btnLogoutText: {
    ...Typography.button,
    color: Colors.white,
  },
});
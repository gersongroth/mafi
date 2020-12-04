import React from 'react'
import { Text, View } from 'react-native'
import styles from './styles';
import { useStores } from '../../../hooks/useStores';
import UserAvatar from 'react-native-user-avatar';
import { observer } from 'mobx-react-lite';

const Profile = observer(() => {
    const { ProfileStore } = useStores();

    return (
        <View style={styles.container}>
            <View
                style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                <UserAvatar size={150} name={ProfileStore.user?.fullName} style={styles.authorAvatar} />
                <Text style={{ marginTop: 20, fontSize: 20 }}>Nome:</Text>
                <Text style={{ fontSize: 32 }}>{ProfileStore.user?.fullName}</Text>
                <Text style={{ marginTop: 20, fontSize: 20  }}>Email:</Text>
                <Text style={{ fontSize: 32 }}>{ProfileStore.user?.email}</Text>
            </View>
        </View>
    )
});

export default Profile;

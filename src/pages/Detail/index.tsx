import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView, Platform, Linking } from 'react-native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'

import api from '../../services/api'

import styles from './styles'

interface RouteParam {
	pointId: number
}

interface Data {
	point: {
		image: string;
		imageUrl: string;
		name: string;
		email: string;
		whatsapp: string;
		city: string;
		uf: string;
	}
	items: {
		title: string
	}[];
}
const Detail = () => {
	const [data, setData] = useState<Data>({} as Data);
	const route = useRoute();

	const navigation = useNavigation();
	const routesParams = route.params as RouteParam;

	useEffect(() => {
		api.get(`points/${routesParams.pointId}`).then(response => {
			setData(response.data);
		})
	})

	function handleNavigateBack() {
		navigation.goBack();
	}

	function handleWhatsapp() {
		Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de residuos.`)
	}

	function handleComposeEmail() {
		MailComposer.composeAsync({
			subject: 'Interesse na coleta de residuos',
			recipients: [data.point.email],
		})
	}

	if (!data.point) {
		return null;
	}
	return (
		<SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : 23 }}>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Icon name='arrow-left' size={20} color='#34cb79' />
				</TouchableOpacity>

				<Image style={styles.pointImage} source={{ uri: data.point.imageUrl }} />
				<Text style={styles.pointName} >{data.point.name}</Text>
				<Text style={styles.pointItems} >
					{data.items.map(item => item.title).join(', ')}
				</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>{data.point.city}</Text>
					<Text style={styles.addressContent}>{data.point.uf}</Text>
				</View>
			</View>

			<View style={styles.footer}>
				<RectButton style={styles.button} onPress={handleWhatsapp}>
					<FontAwesome name='whatsapp' size={20} color='#FFF' />
					<Text style={styles.buttonText}> Whatsapp</Text>
				</RectButton>

				<RectButton style={styles.button} onPress={handleComposeEmail}>
					<Icon name='mail' size={20} color='#FFF' />
					<Text style={styles.buttonText}> Email</Text>
				</RectButton>
			</View>
		</SafeAreaView>
	)
}

export default Detail;

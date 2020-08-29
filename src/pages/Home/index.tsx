import React, { useState, useEffect, useCallback } from 'react'
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Picker from 'react-native-picker-select'
import axios from 'axios'

import styles from './styles'

interface IBGEUFResponse {
	id: number,
	sigla: string
}
interface IBGECityResponse {
	nome: string
	id: number
}
/* interface Picker {
	label: string;
	value: string;
} */

const Home = () => {
	const navigation = useNavigation();
	const [uf, setUf] = useState('')
	const [city, setCity] = useState('')
	const [ufs, setUfs] = useState<IBGEUFResponse[]>([])
	const [cities, setCities] = useState<IBGECityResponse[]>([])
	const [selectedUf, setSelectedUf] = useState('')
	const [selectedCity, setSelectedCity] = useState('')

	useEffect(() => {
		axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((response) => {
			const ufInitials = response.data.map(uf => (
				{
					id: uf.id,
					sigla: uf.sigla
				}
			));

			setUfs(ufInitials)
		})
	}, []);

	useEffect(() => {

		if (selectedUf == '0') {
			return;
		}

		axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
			.then((response) => {
				const citiesInitials = response.data.map(city => (
					{
						id: city.id,
						nome: city.nome,
					}
				))
				setCities(citiesInitials);
			})
	}, [selectedUf]);

	useEffect(() => {
		setSelectedCity(selectedCity)
	}, [selectedCity])

	const handleNavigateToPoints = useCallback((uf, city) => {
		navigation.navigate('Points', {
			uf: uf,
			city: city
		})
	}, [])

	function handleSelectUf(uf: string) {
		console.log(uf)
		setSelectedUf(uf);
	}

	function handleSelectCity(city: string) {
		console.log(city)
		setSelectedCity(city);
	}

	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
			<ImageBackground
				source={require('../../assets/home-background.png')}
				style={styles.container}
				imageStyle={{ width: 274, height: 368 }}
			>
				<View style={styles.main}>
					<Image source={require('../../assets/logo.png')} />
					<View>
						<Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
						<Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
					</View>

				</View>
				<View style={styles.footer}>
					<Picker
						onValueChange={(value) => handleSelectUf(value.toUpperCase())}
						items={ufs.sort((a, b) => (a.sigla < b.sigla) ? -1 : 1).map(uf => (
							{ label: uf.sigla, value: uf.sigla }
						))}
					/>
					<Picker
						onValueChange={(value) => handleSelectCity(value.toUpperCase())}
						items={cities.sort((a, b) => (a.nome < b.nome) ? -1 : 1).map(city => (
							{ label: city.nome, value: city.nome }
						))}
					/>


					<RectButton style={styles.button} onPress={() => handleNavigateToPoints(selectedUf, selectedCity)}>
						<View style={styles.buttonIcon}>
							<Text>
								<Icon name='arrow-right' color='#FFF' size={24} />
							</Text>
						</View>
						<Text style={styles.buttonText}>
							Entrar
        			</Text>
					</RectButton>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	)
}

export default Home;

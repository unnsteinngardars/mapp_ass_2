import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	SectionList,
	ActivityIndicator
} from 'react-native';

import ContactListItem from '../components/ContactListItem';
import ContactListHeader from '../components/ContactListHeader';
import Colors from '../constants/colors';
import data from '../ass2data.json';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: Colors.white
	},
	header: {
		flex: 1,
		// marginLeft: 10,
		paddingTop: 10,
		paddingBottom: 10
	},
	item: {
		flex: 1,
		// marginLeft: 10,
		paddingTop: 4,
		paddingBottom: 4
	}
});

export default class ContactListScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataById: {},
			sections: [],
			loaded: false
		};
	}

	componentDidMount() {
		const { sections, dataById } = this.convertData(data);
		this.sort(sections);
		this.setState({ sections: sections, dataById: dataById, loaded: true });
	}

	/**
	 * Reduces an array to a dictionary of arrays by the letters of the alphabet
	 * @param {Array} data
	 */
	convertData(data) {
		let dataById = {};
		id = 1;
		// acc er fylki
		let sections = data.reduce((acc, item) => {
			var found = false;
			// create object to map items by ID
			item.id = id;
			dataById[id] = item;
			let key = item.name.first_name.charAt(0);
			let value = {
				id: id,
				name: item.name.first_name + ' ' + item.name.last_name
			};

			for (var index in acc) {
				if (acc[index].title == key) {
					acc[index].data.push(value);
					found = true;
					break;
				}
			}
			if (!found) {
				let obj = { title: key, data: [] };
				obj.data.push(value);
				acc.push(obj);
			}
			id++;
			return acc;
		}, []);
		return { sections: sections, dataById: dataById };
	}

	/**
	 * Compare two objects by value of prop
	 * @param {string} prop
	 */
	compare(prop) {
		return (first, second) => {
			if (first[prop] < second[prop]) {
				return -1;
			} else if (first[prop] > second[prop]) {
				return 1;
			} else {
				return 0;
			}
		};
	}

	/**
	 * Sorts the sections array and each data array
	 * @param {Array} data
	 */
	sort(sections) {
		sections.sort(this.compare('title'));
		for (var i in sections) {
			sections[i].data.sort(this.compare('name'));
		}
	}

	toDetails(id) {
		this.props.navigation.navigate(
			'ContactDetail',
			this.state.dataById[id]
		);
	}

	delete(id) {
		const { dataById, sections } = this.state;
		delete dataById[id];
		sections.map(section => {
			const newData = section.data.filter(item => {
				return item.id != id;
			});
			section.data = newData;
			return section;
		});
		this.setState({ sections: sections, dataById: dataById });
	}

	render() {
		const { sections } = this.state;

		if (this.state.loaded) {
			return (
				<View style={styles.container}>
					<ScrollView>
						<SectionList
							sections={sections}
							renderSectionHeader={({ section: { title } }) => (
								<View style={styles.header}>
									<ContactListHeader title={title} />
								</View>
							)}
							renderItem={({ item, index, section }) => (
								<View style={styles.item}>
									<ContactListItem
										delete={id => this.delete(id)}
										passBackId={id => {
											this.toDetails(id);
										}}
										item={item}
									/>
								</View>
							)}
							keyExtractor={(item, index) => item + index}
						/>
					</ScrollView>
				</View>
			);
		} else {
			return <ActivityIndicator />;
		}
	}
}

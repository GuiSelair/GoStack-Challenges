import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("/repositories").then(response => {
      if (response.status === 200){
        setRepositories(response.data);
      }
    })
  }, [])


  async function handleLikeRepository(id) {
    let dataTemp = [...repositories];
    const index = dataTemp.findIndex(repository => repository.id === id);
    if (index >= 0){
      const response = await api.post(`/repositories/${id}/like`);
      if (response.status === 200){
        dataTemp[index].likes += 1;
        setRepositories(dataTemp)
      }
    }
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
          <FlatList 
            data={repositories}
            keyExtractor={repository => repository.id}
            renderItem={({ item:repository }) => (
              <View style={styles.repositoryContainer}>
                <View style={styles.repositoryContainer}>
                  <Text style={styles.repository}>{repository.title}</Text>
                  <View style={styles.techsContainer}>
                    <FlatList 
                      horizontal={true}
                      data={repository.techs}
                      keyExtractor={repository => repository}
                      renderItem={({ item:tech }) => (
                        <Text style={styles.tech}>
                          { tech }
                        </Text>
                      )}
                    />
                  </View>
                  <View style={styles.likesContainer}>
                    <Text
                      style={styles.likeText}
                      testID={`repository-likes-${repository.id}`}
                    >
                      { repository.likes } curtidas
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLikeRepository(repository.id)}
                    testID={`like-button-${repository.id}`}
                  >
                    <Text style={styles.buttonText}>Curtir</Text>
                  </TouchableOpacity>
                </View>
              </View>

            )}
          />

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});

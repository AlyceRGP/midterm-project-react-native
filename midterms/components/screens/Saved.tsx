import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Props } from "../navigation/props"; 

interface Job {
  id: string;
  title: string;
  companyName: string;
  mainCategory: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
}

const SavedJobsScreen: React.FC<Props> = ({ navigation, route }) => {
  const {savedJobs, setSavedJobs} = route.params; 
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmRemoveVisible, setConfirmRemoveVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [whyHire, setWhyHire] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    whyHire: '',
  });

  const { colors } = useTheme();

  const handleApplyPress = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
    setFeedbackMessage('');
  };

  const validateForm = (): boolean => {
    let formIsValid = true;
    let formErrors = { name: '', email: '', contactNumber: '', whyHire: '' };

    if (!name.trim()) {
      formErrors.name = 'Name is required.';
      formIsValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      formErrors.email = 'Email is required.';
      formIsValid = false;
    } else if (!emailPattern.test(email)) {
      formErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
    }

    const contactNumberPattern = /^09\d{9}$/;
    if (!contactNumber.trim()) {
      formErrors.contactNumber = 'Contact number is required.';
      formIsValid = false;
    } else if (!contactNumberPattern.test(contactNumber)) {
      formErrors.contactNumber = 'Please enter a valid contact number (11 digits starting with 09).';
      formIsValid = false;
    }

    if (!whyHire.trim()) {
      formErrors.whyHire = 'This field is required.';
      formIsValid = false;
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const handleSubmitApplication = () => {
    if (validateForm()) {
      setFeedbackMessage('Application submitted successfully!');
      setName('');
      setEmail('');
      setContactNumber('');
      setWhyHire('');
      setErrors({
        name: '',
        email: '',
        contactNumber: '',
        whyHire: '',
      });

      setTimeout(() => {
        setModalVisible(false);

        navigation.goBack();
      }, 2000); 
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setName('');
    setEmail('');
    setContactNumber('');
    setWhyHire('');
    setErrors({
      name: '',
      email: '',
      contactNumber: '',
      whyHire: '',
    });
    setFeedbackMessage('');
  };

  const handleRemoveJob = (job: Job) => {
    setSelectedJob(job);
    setConfirmRemoveVisible(true);  
  };

  const confirmRemove = () => {
    const updatedSavedJobs = savedJobs.filter(savedJob => savedJob.id !== selectedJob?.id);
    setSavedJobs(updatedSavedJobs);

    navigation.setParams({ savedJobs: updatedSavedJobs });
    setConfirmRemoveVisible(false); 
  };

  const cancelRemove = () => {
    setConfirmRemoveVisible(false); 
  };

  const renderSavedJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobContainer, { backgroundColor: colors.card }]}>
      <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.jobCompany, { color: colors.text }]}>{item.companyName}</Text>
      <Text style={[styles.jobCategory, { color: colors.text }]}>Category: {item.mainCategory}</Text>
      <Text style={[styles.jobType, { color: colors.text }]}>Job Type: {item.jobType}</Text>
      <Text style={[styles.jobWorkModel, { color: colors.text }]}>Work Model: {item.workModel}</Text>
      <Text style={[styles.jobSeniority, { color: colors.text }]}>Seniority Level: {item.seniorityLevel}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRemoveJob(item)}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleApplyPress(item)}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {savedJobs.length === 0 ? (
        <Text style={[styles.noJobsMessage, { color: colors.text }]}>No jobs saved yet</Text>
      ) : (
        <FlatList
          data={savedJobs}
          renderItem={renderSavedJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
        />
      )}

      // Apply Modal
      <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          {selectedJob && (
            <View style={[styles.modalContentApply, { backgroundColor: colors.background }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Apply for {selectedJob.title}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Name"
                placeholderTextColor={colors.placeholder}
                value={name}
                onChangeText={setName}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Contact Number"
                placeholderTextColor={colors.placeholder}
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
              {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="Why should we hire you?"
                placeholderTextColor={colors.placeholder}
                value={whyHire}
                onChangeText={setWhyHire}
                multiline
                numberOfLines={4}
              />
              {errors.whyHire && <Text style={styles.errorText}>{errors.whyHire}</Text>}

              {feedbackMessage && <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>}

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.greenButton} onPress={handleCloseModal}>
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.greenButton} onPress={handleSubmitApplication}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      // Remove Job Confirmation Modal
      <Modal
        visible={confirmRemoveVisible}
        animationType="fade"
        onRequestClose={cancelRemove}
        transparent={true}
      >
        <View style={[styles.modalBackground, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContentRemove, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Are you sure you want to remove this job?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#2e6f40' }]}  
                onPress={cancelRemove}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#2e6f40' }]} 
                onPress={confirmRemove}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noJobsMessage: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  jobContainer: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 14,
    color: '#777',
  },
  jobCategory: {
    fontSize: 14,
    marginTop: 4,
  },
  jobType: {
    fontSize: 14,
    marginTop: 4,
  },
  jobWorkModel: {
    fontSize: 14,
    marginTop: 4,
  },
  jobSeniority: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#2e6f40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  flatListContainer: {
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentApply: {
    width: '80%',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 12,
    width: '100%',
  },
  textArea: {
    height: 80,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  feedbackMessage: {
    fontSize: 16,
    color: '#28a745',
    marginBottom: 12,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  greenButton: {
    backgroundColor: '#2e6f40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  
  modalContentRemove: {
    width: '70%', 
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center', 
  },

  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },

  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
});

export default SavedJobsScreen;

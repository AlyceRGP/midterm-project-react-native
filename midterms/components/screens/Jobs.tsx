import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal, ActivityIndicator, Switch } from 'react-native';
import uuid from 'react-native-uuid';
import { Props } from '../navigation/props';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

interface Job {
  id: string;
  title: string;
  companyName: string;
  mainCategory: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;
}

const JobsScreen: React.FC<Props> = ({ navigation, toggleTheme, isDarkMode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
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

  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://empllo.com/api/v1');
      const data = await response.json();

      if (data && data.jobs) {
        const jobsWithIds: Job[] = data.jobs.map((job: Job) => ({
          ...job,
          id: uuid.v4(),
        }));

        setJobs(jobsWithIds);
        setFilteredJobs(jobsWithIds);
      } else {
        Alert.alert('Error', 'No jobs found in the response.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = (term: string) => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(term.toLowerCase()) ||
      job.companyName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    filterJobs(text);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveJob = (job: Job) => {
    setSavedJobs((prevSavedJobs) => {
      const jobIndex = prevSavedJobs.findIndex(savedJob => savedJob.id === job.id);
      if (jobIndex >= 0) {
        const updatedSavedJobs = [...prevSavedJobs];
        updatedSavedJobs.splice(jobIndex, 1);
        return updatedSavedJobs;
      } else {
        return [...prevSavedJobs, job];
      }
    });
  };

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

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.jobCompany, { color: colors.text }]}>{item.companyName}</Text>
      <Text style={[styles.jobCategory, { color: colors.text }]}>Category: {item.mainCategory}</Text>
      <Text style={[styles.jobType, { color: colors.text }]}>Job Type: {item.jobType}</Text>
      <Text style={[styles.jobWorkModel, { color: colors.text }]}>Work Model: {item.workModel}</Text>
      <Text style={[styles.jobSeniority, { color: colors.text }]}>Seniority Level: {item.seniorityLevel}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, savedJobs.some(savedJob => savedJob.id === item.id) && styles.savedButton]}
          onPress={() => handleSaveJob(item)}
        >
          <Text style={styles.buttonText}>
            {savedJobs.some(savedJob => savedJob.id === item.id) ? 'Saved' : 'Save Job'}
          </Text>
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
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
        placeholder="Search by title or company..."
        placeholderTextColor={colors.placeholder}
        value={searchTerm}
        onChangeText={handleSearchChange}
      />

      <TouchableOpacity
        style={styles.savedJobsButton}
        onPress={() => navigation.navigate('Saved Jobs', {
          savedJobs: savedJobs,
          setSavedJobs: setSavedJobs,
        })}
      >
        <Text style={styles.buttonText}>Go to saved jobs</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2e6f40" />
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <Icon
          name="moon"
          size={24}
          color={ colors.text }
          style={{ marginRight: 8 }}
        />
        <Switch
          value={isDarkMode} 
          onValueChange={toggleTheme} 
          trackColor={{ false: '#ddd', true: '#2e6f40' }} 
          thumbColor="#fff" 
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCloseModal}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          {selectedJob && (
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
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

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    padding: 16,
  },
  footer: {
    position: 'absolute', 
    bottom: 0,
    left: 0, 
    right: 0, 
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',   
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    borderColor: '#ddd',
  },
  savedJobsButton: {
    backgroundColor: '#2e6f40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  jobContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
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
  savedButton: {
    backgroundColor: '#2e6f40',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 22,
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
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  feedbackMessage: {
    color: 'green',
    fontSize: 14,
    marginVertical: 8,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greenButton: {
    backgroundColor: '#2e6f40',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '48%',
  },
});

export default JobsScreen;

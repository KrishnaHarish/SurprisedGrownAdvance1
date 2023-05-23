import './App.css';
import React, { useEffect, useState } from 'react';
import { fetchStudentData } from './api';
import { createClient } from '@replit/database';

const client = createClient();

const supabaseUrl = "postgres";
const supabaseKey = "krishnapostgres";
const supabase = client(supabaseUrl, supabaseKey);

console.log(supabase, "((((((((((")

const App = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentData = await fetchStudentData();
      setStudents(studentData);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const saveStudentsToDB = async () => {
      await client.set('students', students);
    };

    saveStudentsToDB();
  }, [students]);

  useEffect(() => {
    const fetchStudentsFromDB = async () => {
      const storedStudents = await client.get('students');
      if (storedStudents) {
        setStudents(storedStudents);
      }
    };

    fetchStudentsFromDB();
  }, []);

  const calculateAverageScore = (scores) => {
    const sum = scores.reduce((total, score) => total + score, 0);
    return sum / scores.length;
  };

  const calculateTotalAverageScore = () => {
    const totalSum = students.reduce((total, student) => total + student.averageScore, 0);
    return totalSum / students.length;
  };

  const findStrongestSubject = (student) => {
    const { math, science, english } = student;
    const maxScore = Math.max(math, science, english);

    if (maxScore === math) {
      return 'Math';
    } else if (maxScore === science) {
      return 'Science';
    } else {
      return 'English';
    }
  };

  return (
    <div>
      <h1>Student Records</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <p>Name: {student.name}</p>
            <p>Math: {student.math}</p>
            <p>Science: {student.science}</p>
            <p>English: {student.english}</p>
            <p>Average Score: {student.averageScore}</p>
            <p>Strongest Subject: {findStrongestSubject(student)}</p>
          </li>
        ))}
      </ul>
      <p>Total Average Score: {calculateTotalAverageScore()}</p>
    </div>
  );
};

export default App;

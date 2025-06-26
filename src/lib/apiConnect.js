import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const fetchAllUsers = () => api.get('/users').then(res => res.data)

export const fetchUsersByName = (name) => api.get(`/users`).then(res => {
  return res.data.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))
});
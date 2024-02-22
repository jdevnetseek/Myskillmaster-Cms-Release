import { Model } from 'vue-api-query'
import api from '@/services/api'

// inject global axios instance as http client to Model
Model.$http = api

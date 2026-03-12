import apimock from './apimock';
import apiclient from './apiClient'; 

const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const blueprintsService = useMock ? apimock : apiclient;

export default blueprintsService;
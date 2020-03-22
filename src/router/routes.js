import Vestibule from './../components/spaces/Vestibule.vue'
import SalleDeBain from './../components/spaces/SalleDeBain.vue'

const routes = [
  { 
	path: '/vestibule', 
	component: Vestibule,
	name: 'vestibule', 
  },
  { 
	path: '/salle-de-bain', 
	component: SalleDeBain,
	name: 'salle-de-bain', 
  },
]

export default routes;
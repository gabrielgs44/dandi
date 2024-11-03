export interface ApiKey {
    id: string
    created_at: string
    name: string
    value: string
    usage: number
    monthly_limit: number
  }
  
  export interface Toast {
    message: string
    type: 'success' | 'error'
  }
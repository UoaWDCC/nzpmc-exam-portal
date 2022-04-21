import admin from 'firebase-admin'
import * as fireorm from 'fireorm'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

admin.initializeApp({
    projectId: 'nzpmc-backend',
})

const firestore = admin.firestore()
fireorm.initialize(firestore)

import cors from 'cors'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { setGlobalOptions } from 'firebase-functions/v2'
import { onRequest } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

if (!getApps().length) {
  initializeApp()
}

const db = getFirestore()
const corsHandler = cors({ origin: true })

setGlobalOptions({ region: 'australia-southeast2' })

export const countBooks = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const snapshot = await db.collection('books').count().get()
      response.status(200).json({ count: snapshot.data().count })
    } catch (error) {
      console.error('Unable to count books:', error)
      response.status(500).json({ error: 'Unable to count books.' })
    }
  })
})

export const getAllBooks = onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const snapshot = await db.collection('books').get()
      const books = snapshot.docs.map((book) => ({
        id: book.id,
        ...book.data(),
      }))
      response.status(200).json({ books })
    } catch (error) {
      console.error('Unable to get all books:', error)
      response.status(500).json({ error: 'Unable to get all books.' })
    }
  })
})

export const uppercaseBookFields = onDocumentCreated('books/{bookId}', async (event) => {
  const snapshot = event.data
  if (!snapshot) return

  const book = snapshot.data()
  if (typeof book.name !== 'string') return

  const uppercaseName = book.name.toUpperCase()
  if (book.name === uppercaseName) return

  await snapshot.ref.update({ name: uppercaseName })
})

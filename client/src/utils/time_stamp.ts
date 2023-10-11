export const generateTimestamp = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear().toString().padStart(4, '0')
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const day = currentDate.getDate().toString().padStart(2, '0')
  const hour = currentDate.getHours().toString().padStart(2, '0')
  const minute = currentDate.getMinutes().toString().padStart(2, '0')
  const second = currentDate.getSeconds().toString().padStart(2, '0')

  return `${year}-${month}-${day}-${hour}-${minute}-${second}`
}

export const generateDownloadLink = (examName: String, timestamp: String, extension = 'csv') => {
  return `${examName}_${timestamp}.${extension}`
}

import { useState } from 'react'
import { Card, Title, Text, Grid } from "@tremor/react";

function App() {
  const [count, setCount] = useState(0)

  return (
    <main>
      <Title>Padel Games</Title>
      <Text>Create and manage your tournaments!</Text>

      <Card className="mt-6">
        <div className="h-96" />
      </Card>

      <Grid numColsMd={2} className="mt-6 gap-6">
        <Card>
          {/* Placeholder to set height */}
          <div className="h-28" />
        </Card>
        <Card>
          {/* Placeholder to set height */}
          <div className="h-28" />
        </Card>
      </Grid>
    </main>
  )
}

export default App

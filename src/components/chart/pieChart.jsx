`use client`

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomLegend } from './customLegend';
import { Skeleton } from '../ui/skeleton';

export default function PieChartPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
  const searchParams = useSearchParams()
  const workspaceId = searchParams.get('workspace_id')
  const page = searchParams.get('page')
  const paramId = searchParams.get('param_id')

  const fetchData = () => {
    setLoading(true);
    fetch(
      //GET Data
      `${baseUrl}/chart/status-distribution?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch DATA.')
        }
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.message || 'Failed to DATA.')
        }
        setData(data.data)
      })
      .catch((error) => {
        console.error('Error fetching DATA:', error)
      })
      .finally(() => {
        setLoading(false); // Stop loading in all cases
      });
    console.log('SUCCESS FETCH DATA')
  }

    useEffect(() => {
        if (!workspaceId || !page || !paramId || page == 'form') return;
        if (workspaceId && page && paramId) {
            fetchData()
        }
    }, [workspaceId, page, paramId])

  return (
      <Card className="h-full w-full mx-auto">
        <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
            <CardContent className="h-full flex justify-center items-center">
                {loading ? (
                    <Skeleton className="w-full h-full" />
                ) : data.length > 0 ? (
                    <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend content={<CustomLegend />} />
                    </PieChart>
                ) : (
                    <div className="h-full flex justify-center items-center">
                        <h1 className="text-muted-foreground text-2xl m-6">No tasks yet</h1>
                    </div>
                )}
            </CardContent>
        </Card>
  );
}

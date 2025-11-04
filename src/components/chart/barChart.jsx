'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function BarChartPage() {
    const [data, setData] = useState([])
    
    const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
    const searchParams = useSearchParams()
    const workspaceId = searchParams.get('workspace_id')
    const page = searchParams.get('page')
    const paramId = searchParams.get('param_id')

    const fetchData = () => {
        fetch(
          //GET TASKS
          `${baseUrl}/chart/assignee-load?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch DATA.')
            }
            return response.json()
          })
          .then((data) => {
            if (data.error) {
              throw new Error(data.message || 'Failed to fetch DATA.')
            }
            setData(data.data)
          })
          .catch((error) => {
            console.error('Error fetching DATA:', error)
          })
        console.log('SUCCESS FETCH DATA')
      }
    
    useEffect(() => {
        if (!workspaceId || !page || !paramId || page == 'form') return;
        if (workspaceId && page && paramId) {
            fetchData()
        }
    }, [workspaceId, page, paramId])

    return (
        <div className="w-full h-full flex-1 flex flex-col gap-3 shrink">
        <Card className="w-full mx-auto">
            <CardHeader>
            <CardTitle>Load Per Assignee</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
        </div>
    )
}
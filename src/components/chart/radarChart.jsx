'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function RadarChartPage() {

    const [data, setData] = useState([])
    
      const baseUrl = process.env.PUBLIC_NEXT_BASE_URL
      const searchParams = useSearchParams()
      const workspaceId = searchParams.get('workspace_id')
      const page = searchParams.get('page')
      const paramId = searchParams.get('param_id')
    
      const fetchData = () => {
        fetch(
          //GET TASKS
          `${baseUrl}/chart/priority-distribution?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
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
        console.log('SUCCESS FETCH DATA')
      }
    
        useEffect(() => {
            if (!workspaceId || !page || !paramId || page == 'form') return;
            if (workspaceId && page && paramId) {
                fetchData()
            }
        }, [workspaceId, page, paramId])
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
        <Card className="w-full">
            <CardHeader>
            <CardTitle>Task Priority Radar</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="priority" />
                <PolarRadiusAxis />
                <Tooltip />
                <Radar
                    name="Task Count"
                    dataKey="count"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                />
                </RadarChart>
            </ResponsiveContainer>
            </CardContent>
        </Card>
        </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableRankingPage() {
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);
  
    const baseUrl = process.env.PUBLIC_NEXT_BASE_URL;
    const searchParams = useSearchParams();
    const workspaceId = searchParams.get('workspace_id');
    const page = searchParams.get('page');
    const paramId = searchParams.get('param_id');

    const fetchData = () => {
        setLoading(true);
        fetch(
        //GET Ranking
        `${baseUrl}/chart/assignee-ranking?workspace_id=${workspaceId}&page=${page}&param_id=${paramId}`
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
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Assignee Completed Task Ranking</CardTitle>
        </CardHeader>
        <CardContent className="w-full h-[500px]">
            <div className="flex flex-1 w-full h-full">
            {loading ? (
                <Skeleton className="w-full h-full" />
            ) : (
                <ScrollArea type="always" className="w-1 flex-1 border rounded-md">
                {data.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="p-2 min-w-[255px] bg-muted">Ranking</TableHead>
                                    <TableHead className="p-2 min-w-[120px] bg-muted">Name</TableHead>
                                    <TableHead className="p-2 min-w-[120px] bg-muted">Total Task Completed</TableHead>
                                    <TableHead className="p-2 min-w-[150px] bg-muted">Total Task Assigned</TableHead>
                                    <TableHead className="p-2 min-w-[120px] bg-muted">Completion Rate</TableHead>
                                    <TableHead className="p-2 min-w-[120px] bg-muted">Last Completed Task</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((datum, index) => (
                                    <TableRow 
                                        key={datum.name}
                                        className={index % 2 === 1 ? 'bg-gray-100' : ''}
                                    >
                                    <TableCell className="p-2 min-w-[255px]">{datum.rank}</TableCell>
                                    <TableCell className="p-2 min-w-[120px]">{datum.name}</TableCell>
                                    <TableCell className="p-2 min-w-[120px]">{datum.completed_task}</TableCell>
                                    <TableCell className="p-2 min-w-[120px]">{datum.assigned_task}</TableCell>
                                    <TableCell className="p-2 min-w-[150px]">{datum.completion_rate}</TableCell>
                                    <TableCell className="p-2 min-w-[120px]">{datum.last_completed}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" className="w-full" />
                    </>
                ) : (
                    <div className="h-full flex justify-center items-center">
                        <h1 className="text-muted-foreground text-2xl m-6">No Assignee Yet</h1>
                    </div>
                )}
                
                </ScrollArea>
            )}
            </div>
        </CardContent>
        </Card>
    );
}

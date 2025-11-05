-- Allow admins to insert doctors
CREATE POLICY "Admins can insert doctors"
ON public.doctors
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update doctors
CREATE POLICY "Admins can update doctors"
ON public.doctors
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete doctors
CREATE POLICY "Admins can delete doctors"
ON public.doctors
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
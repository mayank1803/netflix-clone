
import { NextPageContext } from 'next'
import {getSession,signOut} from 'next-auth/react'
import useCurrentUser from '@/hooks/useCurrentUser';
import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import InfoModal from '@/components/InfoModal';
import useInfoModal from '@/hooks/useInfoModalStore';
export async function getServerSideProps(context:NextPageContext){
  const session = await getSession(context);
  if(!session){
    return{
      redirect:{
        destination:'/auth',
        permanent:false,
      }
    }
  }
  return {
    props:{}
}
}




export default function Home() {
  const {data:movies=[]}=useMovieList();
  const {data:favorites=[]} = useFavorites();
  const {isOpen,closeModal} =useInfoModal();
  return (
    <div>
      <InfoModal visible={isOpen} onClose={closeModal} />
    <Navbar />
    <Billboard />
    <div className='pb-40'>
      <MovieList title='Treding Now' data={movies} />
      <MovieList title='Favourites' data={favorites} />

    </div>
    </div>

  )
}

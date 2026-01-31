import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Building, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const projects = [
  {
    id: '1',
    name: 'Palm Hills New Cairo',
    location: 'New Cairo, Egypt',
    developer: 'Palm Hills Developments',
    totalUnits: 1200,
    availableUnits: 342,
    startingPrice: 3500000,
    deliveryYear: 2025,
    progress: 85,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    featured: true,
  },
  {
    id: '2',
    name: 'Marina Bay Residences',
    location: 'North Coast, Egypt',
    developer: 'SODIC',
    totalUnits: 800,
    availableUnits: 156,
    startingPrice: 5000000,
    deliveryYear: 2024,
    progress: 100,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    featured: true,
  },
  {
    id: '3',
    name: 'Zayed Heights',
    location: 'Sheikh Zayed, Giza',
    developer: 'Ora Developers',
    totalUnits: 600,
    availableUnits: 89,
    startingPrice: 4200000,
    deliveryYear: 2026,
    progress: 45,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    featured: false,
  },
  {
    id: '4',
    name: 'Capital Gardens',
    location: 'New Administrative Capital',
    developer: 'Mountain View',
    totalUnits: 1500,
    availableUnits: 678,
    startingPrice: 2800000,
    deliveryYear: 2027,
    progress: 30,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    featured: false,
  },
];

const formatPrice = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat('en-EG').format(value);
};

const Projects = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-16 bg-gradient-card border-b border-border/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              {t('projects.title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('projects.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="space-y-8">
            {projects.filter(p => p.featured).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent lg:hidden" />
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
                      {project.name}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-6">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{project.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Developer</p>
                        <p className="font-medium text-foreground">{project.developer}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Available Units</p>
                        <p className="font-medium text-foreground">
                          {project.availableUnits} of {project.totalUnits}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Starting From</p>
                        <p className="font-medium text-primary">
                          {formatPrice(project.startingPrice)} EGP
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Delivery</p>
                        <p className="font-medium text-foreground">{project.deliveryYear}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">{t('projects.progress')}</span>
                        <span className="text-primary font-medium">{project.progress}%</span>
                      </div>
                      <div className="progress-gold h-2">
                        <div
                          className="progress-gold-fill"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link to={`/projects/${project.id}`}>
                      <Button className="btn-gold gap-2">
                        {t('projects.viewProject')}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects Grid */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground mb-12 text-center">
            All Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden group hover:shadow-gold transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  {/* Progress Badge */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between text-xs text-foreground mb-1">
                      <span>{t('projects.progress')}</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="progress-gold h-1.5">
                      <div
                        className="progress-gold-fill"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{project.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-primary font-semibold">
                        {formatPrice(project.startingPrice)} EGP
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span>{project.availableUnits} units</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
